import streamlit as st
import pandas as pd
import time
import plotly.express as px

# Configuração da página Streamlit
st.set_page_config(
    page_title="Pirapire PaaS - Antivírus Fiscal & Auditoria Tributária",
    page_icon="🛡️🦈",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Estilização CSS de alto padrão (Glassmorphism, Dark Mode executivo, Tipografia Inter)
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    /* Header principal */
    .hero-container {
        background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
        border: 1px solid #334155;
        border-radius: 16px;
        padding: 24px 32px;
        margin-bottom: 24px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .hero-title {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(90deg, #38BDF8 0%, #818CF8 50%, #34D399 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 6px;
    }
    .hero-subtitle {
        color: #94A3B8;
        font-size: 1.05rem;
        font-weight: 400;
    }

    /* Placar Gigante Scorecard */
    .scorecard-card {
        background: radial-gradient(circle at top left, #064E3B 0%, #022C22 50%, #0F172A 100%);
        border: 2px solid #10B981;
        border-radius: 18px;
        padding: 28px;
        box-shadow: 0 0 35px -5px rgba(16, 185, 129, 0.35);
        text-align: center;
        margin-bottom: 16px;
    }
    .scorecard-label {
        font-size: 1.1rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #6EE7B7;
        margin-bottom: 8px;
    }
    .scorecard-value {
        font-size: 3.5rem;
        font-weight: 900;
        color: #FFFFFF;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }
    .scorecard-sub {
        color: #A7F3D0;
        font-size: 0.95rem;
        margin-top: 6px;
    }

    /* Marketplace Call to Action Hero Card */
    .marketplace-hero {
        background: linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%);
        border: 2px solid #6366F1;
        border-radius: 16px;
        padding: 20px 24px;
        margin-bottom: 24px;
        box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.35);
    }
    .marketplace-hero-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #FFFFFF;
        margin-bottom: 4px;
    }
    .marketplace-hero-sub {
        color: #C7D2FE;
        font-size: 0.95rem;
    }

    /* Badges */
    .badge-danger {
        background-color: rgba(239, 68, 68, 0.2);
        color: #F87171;
        border: 1px solid #EF4444;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.85rem;
    }
    .badge-success {
        background-color: rgba(16, 185, 129, 0.2);
        color: #34D399;
        border: 1px solid #10B981;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.85rem;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Simuladores de dados
clientes_mock = {
    "Indústria e Comércio Alvorada S/A (12.345.678/0001-99)": {"cnpj": "12.345.678/0001-99", "razao": "Indústria e Comércio Alvorada S/A", "regime": "Lucro Real", "segmento": "industria"},
    "Oficina Mecânica do João MEI (11.222.333/0001-44)": {"cnpj": "11.222.333/0001-44", "razao": "Oficina Mecânica do João MEI", "regime": "Simples Nacional", "segmento": "servicos"}
}

# ============================================================================
# SIDEBAR
# ============================================================================
st.sidebar.markdown(
    """
    <div style='text-align: center; padding: 12px 0;'>
        <h2 style='color: #38BDF8; margin: 0;'>🛡️ Pirapire PaaS</h2>
        <span style='color: #94A3B8; font-size: 0.85rem;'>Auditoria & Antivírus Fiscal</span>
    </div>
    """,
    unsafe_allow_html=True,
)
st.sidebar.markdown("---")

cliente_selecionado = st.sidebar.selectbox("🏢 Empresa Selecionada", list(clientes_mock.keys()))
cliente = clientes_mock[cliente_selecionado]

st.sidebar.caption(f"**Regime:** {cliente['regime']} | **Segmento:** {cliente['segmento']}")
st.sidebar.markdown("---")

st.sidebar.subheader("📄 Ingestão de XML real (Simulação)")
st.sidebar.caption("Faz upload de um XML e simula a extração de dados e auditoria fiscal.")
arquivos_xml = st.sidebar.file_uploader(
    "Upload NF-e ou NFS-e (.xml)",
    type=["xml"],
    accept_multiple_files=True,
)

# Estado da simulação
if "upload_success" not in st.session_state:
    st.session_state.upload_success = False
if "is_simples_warning" not in st.session_state:
    st.session_state.is_simples_warning = False

if st.sidebar.button("🚀 Ingerir e Auditar Documentos", type="primary", use_container_width=True):
    if arquivos_xml:
        with st.spinner("Processando e auditando documento(s) fiscal(is)..."):
            time.sleep(2)  # Simula processamento
            
            if cliente["regime"] == "Simples Nacional":
                st.session_state.is_simples_warning = True
                st.session_state.upload_success = False
                st.sidebar.warning("A nota foi ignorada pois pertence ao Simples Nacional e não gera créditos para a empresa selecionada.")
            else:
                st.session_state.upload_success = True
                st.session_state.is_simples_warning = False
                st.sidebar.success("🎉 Lote processado! 1 doc(s) auditado(s) • Total apurado: R$ 4.500,00")
    else:
        st.sidebar.error("Por favor, faça o upload de pelo menos um arquivo XML.")

st.sidebar.markdown("---")
st.sidebar.markdown(
    """
    <div style='font-size: 0.8rem; color: #64748B; margin-top: 20px;'>
    <b>Status da Infraestrutura (MOCK):</b><br>
    ✅ Database (Mock estático)<br>
    ✅ FastAPI REST (Mock)<br>
    ✅ MinIO (Mock)<br>
    ✅ Kafka (Mock)<br>
    </div>
    """, unsafe_allow_html=True
)

# ============================================================================
# PAINEL PRINCIPAL
# ============================================================================
st.markdown(
    f"""
    <div class='hero-container'>
        <div class='hero-title'>🛡️ Auditoria Tributária & Antivírus Fiscal</div>
        <div class='hero-subtitle'>Painel Executivo da Camada Gold para <b>{cliente['razao']}</b> (CNPJ: {cliente['cnpj']}) &bull; Regime: <b>{cliente['regime']}</b></div>
    </div>
    """,
    unsafe_allow_html=True,
)

if st.session_state.is_simples_warning:
    st.warning("⚠️ Atenção: Detectamos que esta empresa/nota pertence ao regime do Simples Nacional. Pelas regras da Receita Federal, este regime não permite o creditamento de PIS/COFINS. O cálculo foi ignorado para evitar passivo fiscal.")

# Dados dinâmicos baseados no estado
total_recuperavel = 4500.00 if st.session_state.upload_success else 0.00
total_pago = 12500.00 if st.session_state.upload_success else 0.00
total_correto = 8000.00 if st.session_state.upload_success else 0.00

# Scorecard
st.markdown(
    f"""
    <div class='scorecard-card'>
        <div class='scorecard-label'>💰 Valor Total Disponível para Recuperação</div>
        <div class='scorecard-value'>R$ {total_recuperavel:,.2f}</div>
        <div class='scorecard-sub'>Créditos tributários identificados em PIS (1,65%) e COFINS (7,60%) sobre insumos elegíveis</div>
    </div>
    """,
    unsafe_allow_html=True,
)

st.markdown(
    """
    <div class='marketplace-hero'>
        <div class='marketplace-hero-title'>🤝 Precisa de ajuda para resgatar este valor na Receita?</div>
        <div class='marketplace-hero-sub'>
            Conecte-se com advogados tributaristas e peritos contábeis homologados para compensação imediata via PER/DCOMP com segurança jurídica total.
        </div>
    </div>
    """,
    unsafe_allow_html=True,
)

# Métricas complementares
c1, c2, c3 = st.columns(3)
with c1:
    st.metric(label="Total Imposto Pago (Bronze)", value=f"R$ {total_pago:,.2f}")
with c2:
    st.metric(label="Total Imposto Devido (Systax)", value=f"R$ {total_correto:,.2f}")
with c3:
    st.metric(label="Períodos Fiscais Auditados", value="1 meses" if st.session_state.upload_success else "0 meses", delta="100% Medallion" if st.session_state.upload_success else None)

st.markdown("<br>", unsafe_allow_html=True)

# Tabela de Itens Auditados Simulados
if st.session_state.upload_success:
    st.subheader("📊 Itens Auditados & Regras Fiscais Armazenadas")
    df_itens_data = [
        {
            "Tipo_Documento": "NF-e",
            "Identificador": "...88550014",
            "Descrição": "Servidor Dell PowerEdge R740",
            "NCM / LC 116": "84714100",
            "CFOP / Código": "1551",
            "CST / Regime": "50",
            "Valor Bruto / Base": "R$ 25.000,00",
            "Valor Recuperável": "R$ 2.312,50",
            "Elegível?": "✅ Sim",
            "Regra / Motivo Glosa": "Ativo Imobilizado - 1/48 Avos",
        },
        {
            "Tipo_Documento": "NF-e",
            "Identificador": "...88550014",
            "Descrição": "Licenças de Software Corporativo",
            "NCM / LC 116": "85234990",
            "CFOP / Código": "1556",
            "CST / Regime": "50",
            "Valor Bruto / Base": "R$ 10.000,00",
            "Valor Recuperável": "R$ 925,00",
            "Elegível?": "✅ Sim",
            "Regra / Motivo Glosa": "Insumo Essencial - PIS/COFINS",
        },
        {
            "Tipo_Documento": "NFS-e",
            "Identificador": "NFS-e Nº 2024102",
            "Descrição": "Serviço de Consultoria de TI",
            "NCM / LC 116": "LC 01.01",
            "CFOP / Código": "Prestação de Serviço",
            "CST / Regime": "Retenção Fonte",
            "Valor Bruto / Base": "R$ 15.000,00",
            "Valor Recuperável": "R$ 1.262,50",
            "Elegível?": "✅ Retido",
            "Regra / Motivo Glosa": "Retenção Federal na Fonte (PIS/COFINS/CSLL/IRRF)",
        }
    ]
    st.dataframe(pd.DataFrame(df_itens_data), use_container_width=True, hide_index=True)


# Abas do Dashboard
tab_visao, tab_glosas, tab_antivirus, tab_infra = st.tabs([
    "📈 Visão Geral & Linha do Tempo",
    "🔍 Transparência Fiscal (Relatório de Glosas)",
    "🚨 Antivírus Fiscal (Fornecedores)",
    "⚡ Operações SEFAZ & Circuit Breaker",
])

with tab_visao:
    st.subheader("📈 Linha do Tempo: Recuperação Retroativa de Créditos Fiscais")
    if st.session_state.upload_success:
        df_timeline = pd.DataFrame({
            "Mês/Ano": ["Set/2023"],
            "Crédito PIS/COFINS (R$)": [4500.00]
        })
        fig = px.bar(df_timeline, x="Mês/Ano", y="Crédito PIS/COFINS (R$)", title="Evolução de Créditos")
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Faça o upload de um XML para visualizar o gráfico de evolução temporal.")

with tab_glosas:
    st.subheader("🔍 Relatório de Glosas & Transparência Fiscal")
    if st.session_state.upload_success:
        df_glosas = pd.DataFrame([
            {
                "Chave de Acesso (NF-e)": "35240198765432000188550010000010011000000014",
                "Descrição do Item": "Material de Limpeza e Escritório",
                "CFOP": "1556",
                "NCM": "34022000",
                "CST PIS": "70",
                "CST COFINS": "70",
                "Motivo da Glosa Fiscal": "Uso e Consumo",
                "Imposto Pago (R$)": 500.00,
                "Crédito Permitido (R$)": 0.00,
            }
        ])
        st.dataframe(df_glosas, use_container_width=True, hide_index=True)
        
        st.info(
            "💡 **Critérios de Glosa Fiscal Aplicados:**\n\n"
            "1. **Lucro Presumido (< 2027)**: Empresas em regime cumulativo não possuem direito a apropriação de créditos de PIS/COFINS (Leis 10.637/02 e 10.833/03).\n"
            "2. **Uso e Consumo (CFOP 1556 / 2556)**: Materiais adquiridos para uso ou consumo do estabelecimento são expressamente vedados à tomada de créditos.\n"
            "3. **CST sem direito a crédito (Fora de 50 a 56)**: Operações com CSTs como 01, 70 ou 99 não representam insumos com direito legal de creditamento.\n"
            "4. **Insumos Elegíveis**: Itens que superam as 3 validações recebem 1,65% (PIS) e 7,60% (COFINS) sobre a base de cálculo."
        )
    else:
        st.info("Nenhuma glosa processada até o momento.")

with tab_antivirus:
    st.subheader("🚨 Antivírus Fiscal (Fornecedores)")
    st.info("Monitoramento de fornecedores (simulação ativada). Não há fornecedores inidôneos registrados neste cenário.")

with tab_infra:
    st.subheader("⚡ Operações SEFAZ & Circuit Breaker")
    st.info("Status da integração com a SEFAZ Nacional simulado (Read-only frontend ativo).")
