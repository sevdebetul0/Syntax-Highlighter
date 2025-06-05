class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
        this.tree = [];
    }

    parseProgram() {
        const statements = [];
        while (!this.isAtEnd()) {
            const stmt = this.parseStatement();
            if (stmt) {
                statements.push(stmt);
            } else {
                this.advance(); // hata varsa geçmesi için
            }
        }
        this.tree = { type: 'Program', body: statements };
        return this.tree;
    }

    parseStatement() {
        if (this.match('KEYWORD', 'function')) {
            return this.parseFunctionDecl();
        } else if (this.check('KEYWORD', 'let') || this.check('KEYWORD', 'const') || this.check('KEYWORD', 'var')) {
            return this.parseVarDecl();
        } else {
            return this.parseExpression();
        }
    }

    parseFunctionDecl() {
        const name = this.consume('IDENTIFIER', 'function isimsiz olamaz');
        this.consume('BRACKET', '(');
        const params = this.parseParameters();
        this.consume('BRACKET', ')');
        const body = this.parseBlock();
        return {
            type: 'FunctionDecl',
            name: name.value,
            params,
            body
        };
    }

    parseParameters() {
        const params = [];
        if (this.check('BRACKET', ')')) return params;

        do {
            const param = this.consume('IDENTIFIER', 'Parametre adı bekleniyor');
            params.push(param.value);
        } while (this.match('OPERATOR', ','));

        return params;
    }

    parseBlock() {
        this.consume('BRACKET', '{');
        const statements = [];
        while (!this.check('BRACKET', '}') && !this.isAtEnd()) {
            const stmt = this.parseStatement();
            if (stmt) statements.push(stmt);
        }
        this.consume('BRACKET', '}');
        return { type: 'Block', body: statements };
    }

    parseVarDecl() {
        const kind = this.advance().value;
        const name = this.consume('IDENTIFIER', 'Değişken adı bekleniyor');
        this.consume('OPERATOR', '=');
        const initializer = this.parseExpression();
        return {
            type: 'VarDecl',
            kind,
            name: name.value,
            value: initializer
        };
    }

    parseExpression() {
        const left = this.advance(); // örnek olarak tek terimli ifade
        if (this.match('OPERATOR')) {
            const operator = this.previous().value;
            const right = this.advance();
            return {
                type: 'Expression',
                operator,
                left: left.value,
                right: right.value
            };
        }
        return {
            type: 'Expression',
            value: left.value
        };
    }

    // Yardımcı fonksiyonlar
    match(type, value = null) {
        if (this.check(type, value)) {
            this.advance();
            return true;
        }
        return false;
    }

    consume(type, message) {
        if (this.check(type)) return this.advance();
        throw new Error(`${message} Satır: ${this.peek().line}`);
    }

    check(type, value = null) {
        if (this.isAtEnd()) return false;
        const token = this.peek();
        return token.type === type && (value === null || token.value === value);
    }

    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    peek() {
        return this.tokens[this.current];
    }

    previous() {
        return this.tokens[this.current - 1];
    }

    isAtEnd() {
        return this.current >= this.tokens.length;
    }
}
