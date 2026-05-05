from flask import Flask, request, jsonify
from flask_cors import CORS
from infrastructure.database.supabase_client import get_supabase_client
from domain.entities import AcaiProducer, Driver, Brickyard
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
        driver = Driver(
            name=data["driver"]["name"],
            license_plate=data["driver"]["license_plate"],
            max_capacity_kg=data["driver"]["max_capacity_kg"],
        )
        brickyard = Brickyard(
            company_name=data["brickyard"]["company_name"],
            latitude=data["brickyard"]["latitude"],
            longitude=data["brickyard"]["longitude"],
            storage_capacity_ton=data["brickyard"]["storage_capacity_ton"],
        )

        collection = request_collection(
            producer=producer,
            driver=driver,
            brickyard=brickyard,
            volume_kg=data["volume_kg"],
        )

        supabase = get_supabase_client()
        supabase.table("collections").insert({
            "id": collection.id,
            "producer_name": producer.business_name,
            "driver_name": driver.name,
            "brickyard_name": brickyard.company_name,
            "collected_volume_kg": collection.collected_volume_kg,
            "status": collection.status.value,
            "scheduled_at": collection.scheduled_at.isoformat(),
        }).execute()

        return jsonify({
            "message": "Collection created successfully.",
            "collection_id": collection.id,
            "status": collection.status.value,
        }), 201

    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/collections", methods=["GET"])
def list_collections():
    try:
        status_filter = request.args.get("status", "PENDING")
        supabase = get_supabase_client()
        result = supabase.table("collections").select("*").eq("status", status_filter).execute()
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/collections/<collection_id>", methods=["PATCH"])
def update_collection(collection_id):
    data = request.get_json()
    try:
        supabase = get_supabase_client()
        result = supabase.table("collections").update({
            "status": data["status"]
        }).eq("id", collection_id).execute()
        return jsonify({"message": "Collection updated.", "data": result.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500