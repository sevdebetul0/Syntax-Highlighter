function highlightCode(code, tokens) {
    let highlighted = '';
    let currentIndex = 0;

    for (const token of tokens) {
        // Token pozisyonundan önceki metni ekle
        const before = code.slice(currentIndex, token.pos);
        highlighted += escapeHtml(before);

        // Token'ı renklendir
        const className = getTokenClass(token.type);
        highlighted += `<span class="${className}">${escapeHtml(token.value)}</span>`;
        currentIndex = token.pos + token.length;
    }

    // Kalan metni ekle
    highlighted += escapeHtml(code.slice(currentIndex));
    return highlighted;
}

function getTokenClass(type) {
    switch (type) {
        case 'KEYWORD': return 'keyword';
        case 'STRING': return 'string';
        case 'NUMBER': return 'number';
        case 'IDENTIFIER': return 'identifier';
        case 'OPERATOR': return 'operator';
        case 'FUNCTION': return 'function';
        case 'COMMENT': return 'comment';
        case 'BRACKET': return 'bracket';
        case 'ERROR': return 'error';
        default: return '';
    }
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;");
}

// Gelişmiş JavaScript tokenizer
function tokenizeJavaScript(code) {
    const tokens = [];
    let pos = 0;
    
    const keywords = new Set([
        'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
        'function', 'return', 'var', 'let', 'const', 'class', 'extends',
        'import', 'export', 'from', 'try', 'catch', 'finally', 'throw',
        'new', 'this', 'super', 'null', 'undefined', 'true', 'false',
        'typeof', 'instanceof', 'in', 'of', 'async', 'await', 'yield'
    ]);
    
    const operators = new Set([
        '+', '-', '*', '/', '%', '=', '==', '===', '!=', '!==',
        '<', '>', '<=', '>=', '&&', '||', '!', '?', ':', ';',
        '+=', '-=', '*=', '/=', '%=', '++', '--', '=>'
    ]);
    
    const brackets = new Set(['(', ')', '[', ']', '{', '}']);
    
    while (pos < code.length) {
        const char = code[pos];
        
        // Boşluk karakterlerini atla
        if (/\s/.test(char)) {
            pos++;
            continue;
        }
        
        // Yorumlar
        if (char === '/' && code[pos + 1] === '/') {
            const start = pos;
            while (pos < code.length && code[pos] !== '\n') {
                pos++;
            }
            tokens.push({
                type: 'COMMENT',
                value: code.slice(start, pos),
                pos: start,
                length: pos - start
            });
            continue;
        }
        
        if (char === '/' && code[pos + 1] === '*') {
            const start = pos;
            pos += 2;
            while (pos < code.length - 1 && !(code[pos] === '*' && code[pos + 1] === '/')) {
                pos++;
            }
            pos += 2;
            tokens.push({
                type: 'COMMENT',
                value: code.slice(start, pos),
                pos: start,
                length: pos - start
            });
            continue;
        }
        
        // String literalleri
        if (char === '"' || char === "'" || char === '`') {
            const start = pos;
            const quote = char;
            pos++;
            while (pos < code.length && code[pos] !== quote) {
                if (code[pos] === '\\') pos++; // Escape karakteri
                pos++;
            }
            pos++; // Kapanış tırnak
            tokens.push({
                type: 'STRING',
                value: code.slice(start, pos),
                pos: start,
                length: pos - start
            });
            continue;
        }
        
        // Sayılar
        if (/\d/.test(char)) {
            const start = pos;
            while (pos < code.length && /[\d.]/.test(code[pos])) {
                pos++;
            }
            tokens.push({
                type: 'NUMBER',
                value: code.slice(start, pos),
                pos: start,
                length: pos - start
            });
            continue;
        }
        
        // Operatörler (2 karakterli önce kontrol et)
        const twoChar = code.slice(pos, pos + 2);
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
        
        // Identifier'lar (değişken adları, fonksiyon adları, vb.)
        if (/[a-zA-Z_$]/.test(char)) {
            const start = pos;
            while (pos < code.length && /[a-zA-Z0-9_$]/.test(code[pos])) {
                pos++;
            }
            const value = code.slice(start, pos);
            
            // Fonksiyon çağrısı kontrolü
            let nextNonSpace = pos;
            while (nextNonSpace < code.length && /\s/.test(code[nextNonSpace])) {
                nextNonSpace++;
            }
            
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
        
        // Bilinmeyen karakterler
        pos++;
    }
    
    return tokens;
}