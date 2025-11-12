// 🌸=========================================
// LITGIRL • JAVASCRIPT PRINCIPAL
// =========================================

// 🔹 Confirmação de carregamento
console.log("✨ main.js carregado com sucesso!");

// 🌸 CONSTANTES E CONFIGURAÇÕES
const CONFIG = {
    themeKey: 'litgirl_theme',
    components: {
        header: './header.html',
        footer: './footer.html'
    },
    selectors: {
        headerContainer: '#header-container',
        footerContainer: '#footer-container',
        themeToggle: '#theme-toggle',
        mainContent: '#main-content'
    }
};

// 🔹 CARREGA HEADER E FOOTER DINAMICAMENTE
async function carregarComponentes() {
    try {
        console.log('🔄 Carregando componentes...');
        
        const [headerResp, footerResp] = await Promise.all([
            fetch(CONFIG.components.header),
            fetch(CONFIG.components.footer)
        ]);

        // Verifica se as requisições foram bem sucedidas
        if (!headerResp.ok || !footerResp.ok) {
            throw new Error(`Erro HTTP: Header ${headerResp.status}, Footer ${footerResp.status}`);
        }

        const [headerHTML, footerHTML] = await Promise.all([
            headerResp.text(),
            footerResp.text()
        ]);

        // Insere os componentes no DOM
        document.querySelector(CONFIG.selectors.headerContainer).innerHTML = headerHTML;
        document.querySelector(CONFIG.selectors.footerContainer).innerHTML = footerHTML;

        console.log("✅ Header e Footer carregados com sucesso!");
        
        // Após carregar componentes, inicializa funcionalidades específicas
        inicializarHeader();
        inicializarFooter();
        
    } catch (error) {
        console.error("❌ Erro ao carregar componentes:", error);
        carregarFallbackComponents();
    }
}

// 🔹 FALLBACK PARA COMPONENTES (caso haja erro)
function carregarFallbackComponents() {
    const fallbackHeader = `
        <header class="header-principal">
            <div class="logo">
                <a href="index.html" class="logo-link">🌸 LitGirl</a>
            </div>
            <nav class="nav-principal">
                <a href="index.html" class="nav-link">Início</a>
                <a href="biblioteca.html" class="nav-link">Biblioteca</a>
                <a href="perfil.html" class="nav-link">Perfil</a>
                <a href="sobre.html" class="nav-link">Sobre</a>
            </nav>
        </header>
    `;
    
    const fallbackFooter = `
        <footer class="footer-principal">
            <div class="footer-conteudo">
                <p>© 2025 LitGirl • Feito com 💖 por Bianca Oliveira</p>
                <p>Um espaço criado para leitoras que amam livros, cafés e boas histórias. ☕📚</p>
            </div>
        </footer>
    `;
    
    document.querySelector(CONFIG.selectors.headerContainer).innerHTML = fallbackHeader;
    document.querySelector(CONFIG.selectors.footerContainer).innerHTML = fallbackFooter;
    console.log("🔄 Componentes fallback carregados");
}

// 🔹 INICIALIZA FUNCIONALIDADES DO HEADER
function inicializarHeader() {
    marcarLinkAtivo();
    inicializarBotaoTemaHeader();
    console.log("✅ Funcionalidades do header inicializadas");
}

// 🔹 INICIALIZA FUNCIONALIDADES DO FOOTER
function inicializarFooter() {
    // Adiciona ano atual dinamicamente no footer
    const anoAtual = new Date().getFullYear();
    const copyrightElement = document.querySelector('.footer-copyright');
    if (copyrightElement) {
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', anoAtual);
    }
    console.log("✅ Funcionalidades do footer inicializadas");
}

// 🌙 SISTEMA DE TEMA CLARO/ESCURO
function alternarTema() {
    const elementoHtml = document.documentElement;
    const temaAtual = elementoHtml.getAttribute('data-theme');
    const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
    
    // Aplica o novo tema
    elementoHtml.setAttribute('data-theme', novoTema);
    
    // Salva preferência
    localStorage.setItem(CONFIG.themeKey, novoTema);
    
    // Atualiza todos os botões de tema
    atualizarBotoesTema(novoTema);
    
    console.log(`🎨 Tema alterado para: ${novoTema}`);
    return novoTema;
}

// 🔹 ATUALIZA TODOS OS BOTÕES DE TEMA
function atualizarBotoesTema(tema) {
    const botoesTema = document.querySelectorAll(CONFIG.selectors.themeToggle);
    const icone = tema === 'dark' ? '🌙' : '☀️';
    
    botoesTema.forEach(botao => {
        botao.innerHTML = icone;
        botao.setAttribute('aria-label', `Tema ${tema === 'dark' ? 'escuro' : 'claro'} ativo`);
    });
}

// 🔹 INICIALIZA BOTÃO DE TEMA NO HEADER
function inicializarBotaoTemaHeader() {
    const botaoTemaHeader = document.querySelector(`${CONFIG.selectors.themeToggle}-header`);
    if (botaoTemaHeader) {
        botaoTemaHeader.addEventListener('click', alternarTema);
        console.log("✅ Botão de tema do header inicializado");
    }
}

// 🌞 APLICA O TEMA SALVO DO LOCALSTORAGE
function aplicarTemaSalvo() {
    const temaSalvo = localStorage.getItem(CONFIG.themeKey) || 'light';
    const elementoHtml = document.documentElement;
    
    elementoHtml.setAttribute('data-theme', temaSalvo);
    atualizarBotoesTema(temaSalvo);
    
    console.log(`🌅 Tema ${temaSalvo} aplicado`);
    return temaSalvo;
}

// 📍 MARCA LINK ATIVO NO MENU
function marcarLinkAtivo() {
    const links = document.querySelectorAll('.nav-principal .nav-link');
    const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        // Remove classe active de todos
        link.classList.remove('active');
        
        // Verifica se é a página atual
        if (href === paginaAtual) {
            link.classList.add('active');
        }
        
        // Para a página inicial
        if (paginaAtual === 'index.html' && href === 'index.html') {
            link.classList.add('active');
        }
    });
    
    console.log(`📍 Navegação sincronizada: ${paginaAtual}`);
}

// 📚 CARREGA LIVROS EM DESTAQUE (EXEMPLO)
async function carregarLivrosDestaque() {
    try {
        const container = document.getElementById('livros-destaque');
        if (!container) return;
        
        // Simulação de carregamento de dados
        const livrosExemplo = [
            {
                id: 1,
                titulo: "Orgulho e Preconceito",
                autor: "Jane Austen",
                capa: "img/livros/orgulho-preconceito.jpg",
                estrelas: 5
            },
            {
                id: 2,
                titulo: "O Pequeno Príncipe",
                autor: "Antoine de Saint-Exupéry", 
                capa: "img/livros/pequeno-principe.jpg",
                estrelas: 5
            },
            {
                id: 3,
                titulo: "A Seleção",
                autor: "Kiera Cass",
                capa: "img/livros/selecao.jpg",
                estrelas: 4
            }
        ];
        
        // Remove loading
        container.innerHTML = '';
        
        // Adiciona livros ao DOM
        livrosExemplo.forEach(livro => {
            const estrelas = '⭐'.repeat(livro.estrelas);
            const card = `
                <div class="card-livro" data-livro-id="${livro.id}">
                    <img src="${livro.capa}" alt="Capa do livro ${livro.titulo}" loading="lazy">
                    <h3>${livro.titulo}</h3>
                    <p class="autor">${livro.autor}</p>
                    <div class="estrelas">${estrelas}</div>
                </div>
            `;
            container.innerHTML += card;
        });
        
        console.log("📚 Livros em destaque carregados");
        
    } catch (error) {
        console.error("❌ Erro ao carregar livros:", error);
    }
}

// 🎯 OBSERVER PARA ANIMAÇÕES AO ROLAR
function inicializarObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visivel');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observa elementos para animação
    const elementosParaAnimar = document.querySelectorAll('.trecho, .card-livro, .secao-titulo');
    elementosParaAnimar.forEach(el => observer.observe(el));
}

// 🔹 MANIPULADOR DE ERROS GLOBAL
function configurarManipuladorErros() {
    window.addEventListener('error', (event) => {
        console.error('🚨 Erro global capturado:', event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('🚨 Promise rejeitada não tratada:', event.reason);
    });
}

// 🚀 INICIALIZAÇÃO GERAL
function inicializarAplicacao() {
    console.log('🚀 Inicializando LitGirl...');
    
    // Configurações iniciais
    configurarManipuladorErros();
    aplicarTemaSalvo();
    
    // Carrega componentes principais
    carregarComponentes();
    
    // Carrega dados dinâmicos
    carregarLivrosDestaque();
    
    // Configura observador de interseção
    inicializarObserver();
    
    // Configura listeners globais
    configurarEventListeners();
    
    console.log('✅ Aplicação inicializada com sucesso!');
}

// 🔧 CONFIGURA EVENT LISTENERS GLOBAIS
function configurarEventListeners() {
    // Botão de tema global
    document.addEventListener("click", (e) => {
        if (e.target.matches(CONFIG.selectors.themeToggle) || e.target.closest(CONFIG.selectors.themeToggle)) {
            alternarTema();
        }
    });
    
    // Navegação suave para links internos
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Atualiza link ativo ao rolar
    window.addEventListener('scroll', () => {
        marcarLinkAtivo();
    });
}

// 📱 DETECÇÃO DE DISPOSITIVO E RECURSOS
function detectarRecursos() {
    const recursos = {
        touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        localStorage: !!window.localStorage,
        intersectionObserver: 'IntersectionObserver' in window,
        promises: 'Promise' in window
    };
    
    console.log('📊 Recursos detectados:', recursos);
    return recursos;
}

// 🎯 QUANDO O DOM ESTIVER PRONTO
document.addEventListener('DOMContentLoaded', function() {
    // Detecta recursos antes de inicializar
    const recursos = detectarRecursos();
    
    if (recursos.promises && recursos.localStorage) {
        inicializarAplicacao();
    } else {
        console.warn('⚠️ Alguns recursos não suportados, carregando versão básica');
        carregarFallbackComponents();
        aplicarTemaSalvo();
    }
});

// 🌸 EXPORTAÇÃO PARA MÓDULOS (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        alternarTema,
        carregarComponentes,
        marcarLinkAtivo
    };
}