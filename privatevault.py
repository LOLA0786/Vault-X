import hashlib

def encrypt(data: str) -> str:
    return "ENC_" + hashlib.sha256(data.encode()).hexdigest()

def generate_zk_proof(response) -> str:
    return "ZK_PROOF_DEMO_ONLY_ABC123"
