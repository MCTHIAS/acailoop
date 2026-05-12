from domain.entities import AcaiProducer, Driver, Brickyard
from use_cases.request_collection import request_collection
from use_cases.assign_brickyard import assign_brickyard
from use_cases.assign_driver import assign_driver
from use_cases.complete_collection import complete_collection

def run_simulation():
    print("--- INICIANDO SIMULAÇÃO DO AÇAÍLOOP ---\n")

    batedor = AcaiProducer(business_name="Açaí do Seu Zé", latitude=-1.4558, longitude=-48.4902)
    olaria = Brickyard(company_name="Olaria São João", latitude=-1.4321, longitude=-48.4711, storage_capacity_ton=50.0)
    motorista = Driver(name="Carlos", license_plate="ABC-1234", max_capacity_kg=1000.0)

    print(f"✅ Atores criados: {batedor.business_name}, {olaria.company_name}, Motorista {motorista.name}")

    print("\n--- PASSO 1: SOLICITAÇÃO (BATEDOR) ---")
    coleta = request_collection(producer=batedor, volume_kg=150.5)
    print(f"📦 Coleta gerada com ID: {coleta.id}")
    print(f"📊 Status inicial: {coleta.status.name}")

    print("\n--- PASSO 2: ACEITAÇÃO (OLARIA) ---")
    resultado_olaria = assign_brickyard(coleta, olaria)
    print(f"🧱 Ação: {resultado_olaria}")
    print(f"📊 Novo status: {coleta.status.name}")

    print("\n--- PASSO 3: ROTEIRIZAÇÃO (MOTORISTA) ---")
    resultado_inicio = assign_driver(coleta, motorista)
    print(f"🚚 Ação: {resultado_inicio}")
    print(f"📊 Novo status: {coleta.status.name}")
    print(f"👨‍✈️ Status do Motorista: {motorista.status.name}")

    print("\n--- PASSO 4: ENTREGA (OLARIA) ---")
    resultado_fim = complete_collection(coleta)
    print(f"🏁 Ação: {resultado_fim}")
    print(f"📊 Status final: {coleta.status.name}")
    print(f"👨‍✈️ Status do Motorista: {motorista.status.name}")

if __name__ == "__main__":
    run_simulation()