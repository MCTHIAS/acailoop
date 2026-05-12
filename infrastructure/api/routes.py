from flask import Flask, request, jsonify
from flask_cors import CORS
from infrastructure.database.supabase_client import get_supabase_client
from domain.entities import AcaiProducer
from use_cases.request_collection import request_collection

app = Flask(__name__)
CORS(app)
app.config['JSON_AS_ASCII'] = False

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "project": "AçaíLoop"}), 200

@app.route("/collections", methods=["POST"])
def create_collection():
    data = request.get_json()
    try:
        producer = AcaiProducer(
            business_name=data["producer"]["business_name"],
            latitude=data["producer"]["latitude"],
            longitude=data["producer"]["longitude"],
        )

        collection = request_collection(
            producer=producer,
            volume_kg=data["volume_kg"],
        )

        supabase = get_supabase_client()
        
        insert_data = {
            "id": collection.id,
            "producer_name": producer.business_name,
            "collected_volume_kg": collection.collected_volume_kg,
            "status": collection.status.value,
            "scheduled_at": collection.scheduled_at.isoformat(),
            "origin_address": data.get("origin_address", "Endereço não informado")
        }
        
        supabase.table("collections").insert(insert_data).execute()

        return jsonify({
            "message": "Collection created successfully.",
            "collection_id": collection.id,
            "status": collection.status.value,
        }), 201

    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/collections', methods=['GET'])
def get_collections():
    status_filter = request.args.get('status')
    user_name = request.args.get('user_name')
    role = request.args.get('role')

    supabase = get_supabase_client()
    query = supabase.table("collections").select("*")

    if status_filter:
        query = query.eq("status", status_filter)

    if user_name and role:
        if role == "batedor":
            query = query.eq("producer_name", user_name)
        elif role == "olaria":
            if status_filter != "AWAITING_BRICKYARD":
                query = query.eq("brickyard_name", user_name)
        elif role == "motorista":
            if status_filter != "AWAITING_DRIVER":
                query = query.eq("driver_name", user_name)

    try:
        response = query.execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/collections/<collection_id>", methods=["PATCH"])
def update_collection(collection_id):
    data = request.get_json()
    try:
        supabase = get_supabase_client()
        
        update_data = {}
        valid_keys = ["status", "driver_name", "brickyard_name", "destination_address"]
        
        for key in valid_keys:
            if key in data:
                update_data[key] = data[key]

        if not update_data:
            return jsonify({"error": "No valid fields to update."}), 400

        result = supabase.table("collections").update(update_data).eq("id", collection_id).execute()
        
        return jsonify({
            "message": "Collection updated successfully.", 
            "data": result.data
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/metrics', methods=['GET'])
def get_metrics():
    try:
        supabase = get_supabase_client()
        response = supabase.table("collections").select("*").eq("status", "COMPLETED").execute()
        collections = response.data

        total_volume = sum(col.get("collected_volume_kg", 0) for col in collections)
        total_trips = len(collections)
        
        trees_saved = int(total_volume / 150)

        producers = set(col.get("producer_name") for col in collections if col.get("producer_name"))
        drivers = set(col.get("driver_name") for col in collections if col.get("driver_name"))
        brickyards = set(col.get("brickyard_name") for col in collections if col.get("brickyard_name"))
        
        active_partners = len(producers) + len(drivers) + len(brickyards)
        
        if active_partners == 0:
            active_partners = 0

        return jsonify({
            "total_volume_kg": total_volume,
            "total_trips": total_trips,
            "trees_saved": trees_saved,
            "active_partners": active_partners
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500