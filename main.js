// DOM elementleri
const editor = document.getElementById('codeEditor');
const overlay = document.getElementById('highlightOverlay');
const lineNumbers = document.getElementById('lineNumbers');
const tokenList = document.getElementById('tokenList');
const parseTree = document.getElementById('parseTree');
const languageSelect = document.getElementById('languageSelect');

// Event listeners
editor.addEventListener('input', updateHighlight);
editor.addEventListener('scroll', syncScroll);
languageSelect.addEventListener('change', updateHighlight);

// Scroll senkronizasyonu
function syncScroll() {
    overlay.scrollTop = editor.scrollTop;
    overlay.scrollLeft = editor.scrollLeft;
    lineNumbers.scrollTop = editor.scrollTop;
}

// Ana güncelleme fonksiyonu
function updateHighlight() {
    const code = editor.value;
    const language = languageSelect.value;
    
    // Tokenize et
    const tokens = tokenizeCode(code, language);
    
    // Syntax highlight uygula
    const highlightedHTML = highlightCode(code, tokens);
    overlay.innerHTML = highlightedHTML;
    
    // Satır numaralarını güncelle
    updateLineNumbers(code);
    
    // İstatistikleri güncelle
    updateStats(code, tokens);
    
    // Token listesini güncelle
    updateTokenList(tokens);
    
    // Parse tree'yi güncelle
    updateParseTree(tokens);
    
    // Lexer durumunu güncelle
    updateLexerStatus(tokens);
}

// Satır numaralarını güncelle
function updateLineNumbers(code) {
    const lineCount = code.split('\n').length;
    let lineNumbersHTML = '';
    for (let i = 1; i <= lineCount; i++) {
        lineNumbersHTML += i + '\n';
    }
    lineNumbers.textContent = lineNumbersHTML.trim();
}

// İstatistikleri güncelle
function updateStats(code, tokens) {
    const lineCount = code.split('\n').length;
    const errorCount = tokens.filter(token => token.type === 'ERROR').length;
    
    document.getElementById('lineCount').textContent = lineCount;
    document.getElementById('tokenCount').textContent = tokens.length;
    document.getElementById('errorCount').textContent = errorCount;
}

// Token listesini güncelle
function updateTokenList(tokens) {
    let tokenHTML = '';
    tokens.forEach((token, index) => {
        const className = getTokenClass(token.type).toLowerCase();
        tokenHTML += `
            <div class="token-item">
                <span class="${className}">${escapeHtml(token.value)}</span>
                <span>${token.type}</span>
            </div>
        `;
    });
    tokenList.innerHTML = tokenHTML;
}

// Parse tree güncelle (basit AST)
function updateParseTree(tokens) {
    const ast = buildSimpleAST(tokens);
    parseTree.innerHTML = `<pre>${JSON.stringify(ast, null, 2)}</pre>`;
}

// Lexer durumunu güncelle
function updateLexerStatus(tokens) {
    const lastToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;
    const errorCount = tokens.filter(t => t.type === 'ERROR').length;
    
    document.getElementById('lexerState').textContent = errorCount > 0 ? 'Hata var' : 'Hazır';
    document.getElementById('lastToken').textContent = lastToken ? `${lastToken.type}: ${lastToken.value}` : '-';
    document.getElementById('currentPos').textContent = lastToken ? lastToken.pos + lastToken.length : 0;
    
    // Durum rengi
    const stateElement = document.getElementById('lexerState');
    stateElement.className = errorCount > 0 ? 'status-error' : 'status-ready';
}

// Dil bazında tokenizer seçici
function tokenizeCode(code, language) {
    switch (language) {
        case 'javascript':
            return tokenizeJavaScript(code);
        case 'python':
            return tokenizePython(code);
        case 'java':
            return tokenizeJava(code);
        case 'cpp':
            return tokenizeCpp(code);
        default:
            return tokenizeJavaScript(code);
    }
}

// Python tokenizer
function tokenizePython(code) {
    const tokens = [];
    let pos = 0;
    
    const keywords = new Set([
        'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except',
        'finally', 'with', 'as', 'import', 'from', 'return', 'yield', 'lambda',
        'and', 'or', 'not', 'in', 'is', 'None', 'True', 'False', 'pass',
        'break', 'continue', 'global', 'nonlocal', 'async', 'await'
    ]);
    
    return tokenizeGeneric(code, keywords, ['#'], ['"', "'", '"""', "'''"]);
}

// Java tokenizer
function tokenizeJava(code) {
    const keywords = new Set([
        'public', 'private', 'protected', 'static', 'final', 'abstract',
        'class', 'interface', 'extends', 'implements', 'package', 'import',
        'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
        'try', 'catch', 'finally', 'throw', 'throws', 'return', 'new',
        'this', 'super', 'null', 'true', 'false', 'void', 'int', 'double',
        'float', 'char', 'boolean', 'String', 'long', 'short', 'byte'
    ]);
    
    return tokenizeGeneric(code, keywords, ['//', '/*'], ['"', "'"]);
}

// C++ tokenizer
function tokenizeCpp(code) {
    const keywords = new Set([
        'int', 'double', 'float', 'char', 'bool', 'void', 'string',
        'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
        'class', 'struct', 'public', 'private', 'protected', 'virtual',
        'const', 'static', 'inline', 'template', 'typename', 'namespace',
        'using', 'include', 'define', 'ifdef', 'ifndef', 'endif',
        'return', 'new', 'delete', 'this', 'nullptr', 'true', 'false'
    ]);
    
    return tokenizeGeneric(code, keywords, ['//', '/*', '#'], ['"', "'"]);
}

// Genel tokenizer
function tokenizeGeneric(code, keywords, commentStarters, stringDelimiters) {
    const tokens = [];
    let pos = 0;
    
    const operators = new Set([
        '+', '-', '*', '/', '%', '=', '==', '===', '!=', '!==',
        '<', '>', '<=', '>=', '&&', '||', '!', '?', ':', ';',
        '+=', '-=', '*=', '/=', '%=', '++', '--', '=>', '->', '::'
    ]);
    
    const brackets = new Set(['(', ')', '[', ']', '{', '}']);
    
    while (pos < code.length) {
        const char = code[pos];
        
        // Boşluk karakterleri
        if (/\s/.test(char)) {
            pos++;
            continue;
        }
        
        // Yorumlar
        let commentFound = false;
        for (const starter of commentStarters) {
            if (code.substr(pos, starter.length) === starter) {
                const start = pos;
                if (starter === '//' || starter === '#') {
                    while (pos < code.length && code[pos] !== '\n') pos++;
                } else if (starter === '/*') {
                    pos += 2;
                    while (pos < code.length - 1 && code.substr(pos, 2) !== '*/') pos++;
                    pos += 2;
                }
                tokens.push({
                    type: 'COMMENT',
                    value: code.slice(start, pos),
                    pos: start,
                    length: pos - start
                });
                commentFound = true;
                break;
            }
        }
        if (commentFound) continue;
        
        // String literalleri
        let stringFound = false;
        for (const delimiter of stringDelimiters) {
            if (code.substr(pos, delimiter.length) === delimiter) {
                const start = pos;
                pos += delimiter.length;
                while (pos < code.length && code.substr(pos, delimiter.length) !== delimiter) {
                    if (code[pos] === '\\') pos++; // Escape
                    pos++;
                }
                pos += delimiter.length;
                tokens.push({
                    type: 'STRING',
                    value: code.slice(start, pos),
                    pos: start,
                    length: pos - start
                });
                stringFound = true;
                break;
            }
        }
        if (stringFound) continue;
        
        // Sayılar
        if (/\d/.test(char)) {
            const start = pos;
            while (pos < code.length && /[\d.]/.test(code[pos])) pos++;
            tokens.push({
                type: 'NUMBER',
                value: code.slice(start, pos),
                pos: start,
                length: pos - start
            });
            continue;
        }
        
        // Operatörler (2 karakterli)
        const twoChar = code.substr(pos, 2);
        if (operators.has(twoChar)) {
            tokens.push({
                type: 'OPERATOR',
                value: twoChar,
                pos: pos,
                length: 2
            });
            pos += 2;
            continue;
        }
        
        // Tek karakterli operatörler ve parantezler
        if (operators.has(char) || brackets.has(char)) {
            tokens.push({
                type: brackets.has(char) ? 'BRACKET' : 'OPERATOR',
                value: char,
                pos: pos,
                length: 1
            });
            pos++;
            continue;
        }
        
        // Identifier'lar
        if (/[a-zA-Z_$]/.test(char)) {
            const start = pos;
            while (pos < code.length && /[a-zA-Z0-9_$]/.test(code[pos])) pos++;
            const value = code.slice(start, pos);
            
            // Fonksiyon kontrolü
            let nextNonSpace = pos;
            while (nextNonSpace < code.length && /\s/.test(code[nextNonSpace])) nextNonSpace++;
            
            const type = keywords.has(value) ? 'KEYWORD' : 
                        (code[nextNonSpace] === '(' ? 'FUNCTION' : 'IDENTIFIER');
            
            tokens.push({
                type: type,
                value: value,
                pos: start,
                length: pos - start
            });
            continue;
        }
        
        // Bilinmeyen karakter
        pos++;
    }
    
    return tokens;
}

// Basit AST builder
function buildSimpleAST(tokens) {
    const ast = {
        type: 'Program',
        body: [],
        tokens: tokens.length
    };
    
    const statements = [];
    let current = 0;
    
    while (current < tokens.length) {
        const token = tokens[current];
        
        if (token.type === 'KEYWORD') {
            if (token.value === 'function' || token.value === 'def') {
                statements.push({
                    type: 'FunctionDeclaration',
                    name: tokens[current + 1]?.value || 'anonymous'
                });
            } else if (token.value === 'let' || token.value === 'const' || token.value === 'var') {
                statements.push({
                    type: 'VariableDeclaration',
                    name: tokens[current + 1]?.value || 'unknown'
                });
            }
        }
        current++;
    }
    
    ast.body = statements;
    return ast;
}

// İlk yükleme
updateHighlight();