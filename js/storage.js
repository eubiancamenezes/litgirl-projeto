/* 💾=========================================
   LITGIRL • GERENCIAMENTO DE ARMAZENAMENTO
   LocalStorage e Gerenciamento de Dados
   =========================================*/

class LitGirlStorage {
    constructor() {
        this.prefix = 'litgirl_';
        this.initializeStorage();
    }

    /**
     * Inicializa o storage com valores padrão
     */
    initializeStorage() {
        // Tema
        if (!this.get('theme')) {
            this.set('theme', 'light');
        }

        // Livros favoritos
        if (!this.get('favoritos')) {
            this.set('favoritos', []);
        }

        // Histórico de leitura
        if (!this.get('historico_leitura')) {
            this.set('historico_leitura', []);
        }

        // Configurações do usuário
        if (!this.get('configuracoes')) {
            this.set('configuracoes', {
                notificacoes: true,
                modo_leitura: false,
                tamanho_fonte: 'medio',
                mostrar_spoilers: false
            });
        }

        // Dados de livros (cache)
        if (!this.get('livros_cache')) {
            this.set('livros_cache', {});
        }

        // Progresso de leitura
        if (!this.get('progresso_leitura')) {
            this.set('progresso_leitura', {});
        }
    }

    /**
     * Salva um valor no localStorage
     * @param {string} key - Chave do dado
     * @param {any} value - Valor a ser salvo
     */
    set(key, value) {
        try {
            const storageKey = this.prefix + key;
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(storageKey, serializedValue);
            return true;
        } catch (error) {
            console.error('Erro ao salvar no storage:', error);
            return false;
        }
    }

    /**
     * Recupera um valor do localStorage
     * @param {string} key - Chave do dado
     * @param {any} defaultValue - Valor padrão se não existir
     */
    get(key, defaultValue = null) {
        try {
            const storageKey = this.prefix + key;
            const item = localStorage.getItem(storageKey);
            
            if (item === null) {
                return defaultValue;
            }
            
            return JSON.parse(item);
        } catch (error) {
            console.error('Erro ao recuperar do storage:', error);
            return defaultValue;
        }
    }

    /**
     * Remove um item do localStorage
     * @param {string} key - Chave do dado
     */
    remove(key) {
        try {
            const storageKey = this.prefix + key;
            localStorage.removeItem(storageKey);
            return true;
        } catch (error) {
            console.error('Erro ao remover do storage:', error);
            return false;
        }
    }

    /**
     * Limpa todos os dados do LitGirl do localStorage
     */
    clear() {
        try {
            const keysToRemove = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.prefix)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            this.initializeStorage(); // Reinicializa com valores padrão
            return true;
        } catch (error) {
            console.error('Erro ao limpar storage:', error);
            return false;
        }
    }

    /* 🌸 MÉTODOS ESPECÍFICOS PARA LIVROS */

    /**
     * Adiciona um livro aos favoritos
     * @param {object} livro - Dados do livro
     */
    adicionarFavorito(livro) {
        const favoritos = this.get('favoritos', []);
        
        // Verifica se já está nos favoritos
        const jaExiste = favoritos.some(fav => fav.id === livro.id);
        
        if (!jaExiste) {
            favoritos.push({
                ...livro,
                data_adicao: new Date().toISOString()
            });
            
            this.set('favoritos', favoritos);
            this.dispatchEvent('favoritos_alterados', favoritos);
            return true;
        }
        
        return false;
    }

    /**
     * Remove um livro dos favoritos
     * @param {string} livroId - ID do livro
     */
    removerFavorito(livroId) {
        const favoritos = this.get('favoritos', []);
        const novosFavoritos = favoritos.filter(fav => fav.id !== livroId);
        
        if (novosFavoritos.length !== favoritos.length) {
            this.set('favoritos', novosFavoritos);
            this.dispatchEvent('favoritos_alterados', novosFavoritos);
            return true;
        }
        
        return false;
    }

    /**
     * Verifica se um livro está nos favoritos
     * @param {string} livroId - ID do livro
     */
    isFavorito(livroId) {
        const favoritos = this.get('favoritos', []);
        return favoritos.some(fav => fav.id === livroId);
    }

    /**
     * Salva progresso de leitura
     * @param {string} livroId - ID do livro
     * @param {number} pagina - Página atual
     * @param {number} totalPaginas - Total de páginas
     */
    salvarProgresso(livroId, pagina, totalPaginas) {
        const progresso = this.get('progresso_leitura', {});
        const percentual = Math.round((pagina / totalPaginas) * 100);
        
        progresso[livroId] = {
            pagina,
            totalPaginas,
            percentual,
            ultimaLeitura: new Date().toISOString()
        };
        
        this.set('progresso_leitura', progresso);
        this.dispatchEvent('progresso_alterado', progresso[livroId]);
        
        // Adiciona ao histórico
        this.adicionarHistorico(livroId, pagina, percentual);
        
        return progresso[livroId];
    }

    /**
     * Adiciona entrada ao histórico de leitura
     * @param {string} livroId - ID do livro
     * @param {number} pagina - Página atual
     * @param {number} percentual - Percentual lido
     */
    adicionarHistorico(livroId, pagina, percentual) {
        const historico = this.get('historico_leitura', []);
        
        historico.unshift({
            livroId,
            pagina,
            percentual,
            timestamp: new Date().toISOString()
        });
        
        // Mantém apenas os últimos 50 registros
        if (historico.length > 50) {
            historico.splice(50);
        }
        
        this.set('historico_leitura', historico);
    }

    /**
     * Obtém progresso de um livro específico
     * @param {string} livroId - ID do livro
     */
    getProgresso(livroId) {
        const progresso = this.get('progresso_leitura', {});
        return progresso[livroId] || null;
    }

    /* 🎨 MÉTODOS PARA TEMA E CONFIGURAÇÕES */

    /**
     * Salva preferência de tema
     * @param {string} tema - 'light' ou 'dark'
     */
    salvarTema(tema) {
        this.set('theme', tema);
        this.dispatchEvent('tema_alterado', tema);
    }

    /**
     * Obtém tema atual
     */
    getTema() {
        return this.get('theme', 'light');
    }

    /**
     * Alterna entre tema claro e escuro
     */
    alternarTema() {
        const temaAtual = this.getTema();
        const novoTema = temaAtual === 'light' ? 'dark' : 'light';
        
        this.salvarTema(novoTema);
        return novoTema;
    }

    /**
     * Salva configurações do usuário
     * @param {object} configs - Novas configurações
     */
    salvarConfiguracoes(configs) {
        const configuracoesAtuais = this.get('configuracoes', {});
        const novasConfiguracoes = { ...configuracoesAtuais, ...configs };
        
        this.set('configuracoes', novasConfiguracoes);
        this.dispatchEvent('configuracoes_alteradas', novasConfiguracoes);
        
        return novasConfiguracoes;
    }

    /**
     * Obtém configurações atuais
     */
    getConfiguracoes() {
        return this.get('configuracoes', {});
    }

    /* 📊 MÉTODOS PARA ESTATÍSTICAS */

    /**
     * Obtém estatísticas de leitura
     */
    getEstatisticas() {
        const favoritos = this.get('favoritos', []);
        const historico = this.get('historico_leitura', []);
        const progresso = this.get('progresso_leitura', {});
        
        const livrosEmProgresso = Object.keys(progresso).length;
        const livrosConcluidos = Object.values(progresso).filter(p => p.percentual >= 95).length;
        const tempoTotalLeitura = historico.length; // Aproximação
        
        return {
            totalFavoritos: favoritos.length,
            livrosEmProgresso,
            livrosConcluidos,
            tempoTotalLeitura,
            totalSessoesLeitura: historico.length
        };
    }

    /**
     * Obtém histórico recente de leitura
     * @param {number} limite - Número máximo de registros
     */
    getHistoricoRecente(limite = 10) {
        const historico = this.get('historico_leitura', []);
        return historico.slice(0, limite);
    }

    /* 🔔 SISTEMA DE EVENTOS */

    /**
     * Dispara um evento personalizado
     * @param {string} eventName - Nome do evento
     * @param {any} detail - Dados do evento
     */
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(`litgirl:${eventName}`, {
            detail,
            bubbles: true
        });
        
        window.dispatchEvent(event);
    }

    /**
     * Adiciona listener para eventos do storage
     * @param {string} eventName - Nome do evento
     * @param {function} callback - Função callback
     */
    on(eventName, callback) {
        window.addEventListener(`litgirl:${eventName}`, (event) => {
            callback(event.detail);
        });
    }

    /* 💾 MÉTODOS DE BACKUP E RECUPERAÇÃO */

    /**
     * Exporta todos os dados do usuário
     */
    exportarDados() {
        const dados = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.prefix)) {
                const cleanKey = key.replace(this.prefix, '');
                dados[cleanKey] = this.get(cleanKey);
            }
        }
        
        return {
            versao: '1.0',
            dataExportacao: new Date().toISOString(),
            dados
        };
    }

    /**
     * Importa dados para o storage
     * @param {object} dados - Dados exportados
     */
    importarDados(dados) {
        if (dados.versao && dados.dados) {
            Object.keys(dados.dados).forEach(key => {
                this.set(key, dados.dados[key]);
            });
            return true;
        }
        return false;
    }
}

// 🌸 INSTÂNCIA GLOBAL
const litGirlStorage = new LitGirlStorage();

// 🔧 INICIALIZAÇÃO AUTOMÁTICA DO TEMA
document.addEventListener('DOMContentLoaded', function() {
    const temaSalvo = litGirlStorage.getTema();

    document.documentElement.setAttribute('data-theme',temaSalvo);
});1