/*
  Sözcüksel Analiz
*/
class LexicalAnalyzer {
    constructor(language = 'javascript') {
        this.language = language;
        this.tokens = [];
        this.currentPos = 0;
        this.currentLine = 1;
        this.currentCol = 1;
        this.input = '';
        this.errors = [];
        
        this.languageDefinitions = {
            javascript: this.getJavaScriptTokens(),
            python: this.getPythonTokens(),
            java: this.getJavaTokens(),
            cpp: this.getCppTokens()
        };
    }

    /**
     * js token tanımları
     */
    getJavaScriptTokens() {
        return {
            KEYWORD: /^(function|let|const|var|if|else|for|while|return|class|extends|import|export|default|async|await|try|catch|finally|throw|new|this|super|static|public|private|protected|abstract|interface|enum|type|namespace|module|declare|readonly|keyof|typeof|instanceof|in|of|as|is|any|unknown|never|void|null|undefined|boolean|number|string|symbol|bigint|object|true|false|break|continue|do|switch|case|default|with|debugger|delete|yield)(?![a-zA-Z0-9_$])/,
            STRING: /^("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.|${[^}]*})*`)/,
            NUMBER: /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[fFlL]?/,
            COMMENT: /^(\/\/.*|\/\*[\s\S]*?\*\/)/,
            IDENTIFIER: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
            OPERATOR: /^(\+\+|--|===|!==|==|!=|<=|>=|&&|\|\||<<|>>|>>>|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<=|>>=|>>>=|\?\?|\.\.\.|\?\.|\?\?=|\|\|=|&&=|=>|[+\-*/%=<>!&|^~?:;,.])/,
            BRACKET: /^[\(\)\[\]\{\}]/,
            WHITESPACE: /^[\s\n\r\t]+/
        };
    }

    /**
     * Python token tanımları
     */
    getPythonTokens() {
        return {
            KEYWORD: /^(and|as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|with|yield|True|False|None)(?![a-zA-Z0-9_])/,
            STRING: /^("""[\s\S]*?"""|'''[\s\S]*?'''|"([^"\\]|\\.)*"|'([^'\\]|\\.)*')/,
            NUMBER: /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[jJ]?/,
            COMMENT: /^#.*/,
            IDENTIFIER: /^[a-zA-Z_][a-zA-Z0-9_]*/,
            OPERATOR: /^(\*\*=|\/\/=|<<=|>>=|==|!=|<=|>=|<>|\*\*|\/\/|<<|>>|[+\-*/%=<>!&|^~])/,
            BRACKET: /^[\(\)\[\]\{\}]/,
            WHITESPACE: /^[\s\n\r\t]+/
        };
    }

    /**
     * Java token tanımları
     */
    getJavaTokens() {
        return {
            KEYWORD: /^(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|true|false|null)(?![a-zA-Z0-9_$])/,
            STRING: /^("([^"\\]|\\.)*")/,
            CHARACTER: /^('([^'\\]|\\.)')/,
            NUMBER: /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[fFdDlL]?/,
            COMMENT: /^(\/\/.*|\/\*[\s\S]*?\*\/)/,
            IDENTIFIER: /^[a-zA-Z_$][a-zA-Z0-9_$]*/,
            OPERATOR: /^(\+\+|--|==|!=|<=|>=|&&|\|\||<<|>>|>>>|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<=|>>=|>>>=|[+\-*/%=<>!&|^~?:;,.])/,
            BRACKET: /^[\(\)\[\]\{\}]/,
            WHITESPACE: /^[\s\n\r\t]+/
        };
    }

    /**
     * C++ token tanımları
     */
    getCppTokens() {
        return {
            KEYWORD: /^(alignas|alignof|and|and_eq|asm|auto|bitand|bitor|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|not|not_eq|nullptr|operator|or|or_eq|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while|xor|xor_eq)(?![a-zA-Z0-9_])/,
            STRING: /^("([^"\\]|\\.)*")/,
            CHARACTER: /^('([^'\\]|\\.)')/,
            NUMBER: /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[fFlL]?[uU]?/,
            COMMENT: /^(\/\/.*|\/\*[\s\S]*?\*\/)/,
            IDENTIFIER: /^[a-zA-Z_][a-zA-Z0-9_]*/,
            OPERATOR: /^(\+\+|--|<<|>>|<=|>=|==|!=|&&|\|\||::|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<=|>>=|[+\-*/%=<>!&|^~?:;,.])/,
            BRACKET: /^[\(\)\[\]\{\}]/,
            PREPROCESSOR: /^#[a-zA-Z_][a-zA-Z0-9_]*/,
            WHITESPACE: /^[\s\n\r\t]+/
        };
    }

    
     //programlama dilini ayarla
    
    setLanguage(language) {
        this.language = language;
        if (!this.languageDefinitions[language]) {
            throw new Error(`Unsupported language: ${language}`);
        }
    }

    //seçilen dilin token'ları
    getTokenDefinitions() {
        return this.languageDefinitions[this.language] || this.languageDefinitions.javascript;
    }

    tokenize(input) {
        this.input = input;
        this.tokens = [];
        this.errors = [];
        this.currentPos = 0;
        this.currentLine = 1;
        this.currentCol = 1;
        
        const tokenDefinitions = this.getTokenDefinitions();
        
        while (this.currentPos < input.length) {
            let matched = false;
            
            // Try to match each token type
            for (let [type, regex] of Object.entries(tokenDefinitions)) {
                let match = input.slice(this.currentPos).match(regex);
                if (match) {
                    let value = match[0];
                    
                    if (type !== 'WHITESPACE') {
                        let token = {
                            type: type,
                            value: value,
                            line: this.currentLine,
                            col: this.currentCol,
                            pos: this.currentPos,
                            length: value.length
                        };
                        
                        this.processToken(token);
                        this.tokens.push(token);
                    }

                    this.updatePosition(value);
                    this.currentPos += value.length;
                    matched = true;
                    break;
                }
            }
            
            if (!matched) {
                this.handleError(input[this.currentPos]);
            }
        }
        
        return this.tokens;
    }

    //Ek sınıflandırma için bireysel token
    processToken(token) {
        
        if (token.type === 'IDENTIFIER') {
            let nextNonWhitespace = this.peekNextNonWhitespace(token.pos + token.length);
            if (nextNonWhitespace === '(') {
                token.subtype = 'FUNCTION_CALL';
            }
        }
        
        if (token.type === 'STRING' && token.value.startsWith('`')) {
            token.subtype = 'TEMPLATE_LITERAL';
        }
        
        if (token.type === 'NUMBER') {
            if (token.value.includes('.')) {
                token.subtype = 'FLOAT';
            } else if (/^0x/i.test(token.value)) {
                token.subtype = 'HEXADECIMAL';
            } else if (/^0b/i.test(token.value)) {
                token.subtype = 'BINARY';
            } else if (/^0o/i.test(token.value)) {
                token.subtype = 'OCTAL';
            } else {
                token.subtype = 'INTEGER';
            }
        }
    }

    peekNextNonWhitespace(startPos) {
        for (let i = startPos; i < this.input.length; i++) {
            if (!/\s/.test(this.input[i])) {
                return this.input[i];
            }
        }
        return null;
    }

    updatePosition(value) {
        for (let char of value) {
            if (char === '\n') {
                this.currentLine++;
                this.currentCol = 1;
            } else {
                this.currentCol++;
            }
        }
    }

    handleError(char) {
        let error = {
            type: 'LEXICAL_ERROR',
            message: `Unrecognized character: '${char}'`,
            line: this.currentLine,
            col: this.currentCol,
            pos: this.currentPos
        };
        
        this.errors.push(error);
        
        this.tokens.push({
            type: 'ERROR',
            value: char,
            line: this.currentLine,
            col: this.currentCol,
            pos: this.currentPos,
            length: 1,
            error: error.message
        });
        
        if (char === '\n') {
            this.currentLine++;
            this.currentCol = 1;
        } else {
            this.currentCol++;
        }
        this.currentPos++;
    }

     //belirli türdeki tokenları alma
    getTokensByType(tokenType) {
        return this.tokens.filter(token => token.type === tokenType);
    }

    getStatistics() {
        let stats = {
            totalTokens: this.tokens.length,
            totalErrors: this.errors.length,
            totalLines: this.currentLine,
            tokenTypes: {}
        };
        
        this.tokens.forEach(token => {
            stats.tokenTypes[token.type] = (stats.tokenTypes[token.type] || 0) + 1;
        });
        
        return stats;
    }

    reset() {
        this.tokens = [];
        this.errors = [];
        this.currentPos = 0;
        this.currentLine = 1;
        this.currentCol = 1;
        this.input = '';
    }

    getErrors() {
        return this.errors;
    }

    isValid() {
        return this.errors.length === 0;
    }
}