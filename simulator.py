from domain.entities import AcaiProducer, Driver, Brickyard
from use_cases.request_collection import request_collection
from use_cases.assign_driver import assign_driver
from use_cases.complete_collection import complete_collection

def run_simulation():
    print("--- INICIANDO SIMULAÇÃO DO AÇAÍLOOP ---\n")

    # 1. Criando os atores do sistema
    batedor = AcaiProducer(business_name="Açaí do Seu Zé", latitude=-1.4558, longitude=-48.4902)
    motorista = Driver(name="Carlos", license_plate="ABC-1234", max_capacity_kg=1000.0)
    olaria = Brickyard(company_name="Olaria São João", latitude=-1.4321, longitude=-48.4711, storage_capacity_ton=50.0)

    print(f"✅ Atores criados: {batedor.business_name}, Motorista {motorista.name}, {olaria.company_name}")

    # 2. Batedor solicita a coleta
    print("\n--- PASSO 1: SOLICITAÇÃO ---")
    coleta = request_collection(producer=batedor, driver=motorista, brickyard=olaria, volume_kg=150.5)
    print(f"📦 Coleta gerada com ID: {coleta.id}")
    print(f"📊 Status inicial da Coleta: {coleta.status.name}")

    # 3. Sistema aloca o motorista e inicia a rota
    print("\n--- PASSO 2: ROTEIRIZAÇÃO ---")
    resultado_inicio = assign_driver(coleta)
    print(f"🚚 Ação: {resultado_inicio}")
    print(f"📊 Novo status da Coleta: {coleta.status.name}")
    print(f"👨‍✈️ Status do Motorista: {motorista.status.name}")

    # 4. Motorista entrega na olaria e finaliza
    print("\n--- PASSO 3: ENTREGA ---")
    resultado_fim = complete_collection(coleta)
    print(f"🧱 Ação: {resultado_fim}")
    print(f"📊 Status final da Coleta: {coleta.status.name}")
    print(f"👨‍✈️ Status do Motorista: {motorista.status.name}")

if __name__ == "__main__":
    run_simulation()