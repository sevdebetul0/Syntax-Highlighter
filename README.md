# Real-Time Syntax Highlighter 🚀

Gerçek Zamanlı Sözdizimi Vurgulayıcı - Çoklu programlama dili desteği ile gelişmiş web tabanlı kod uygulamasıdır.


## ✨ Özellikler

- **🔥 Gerçek Zamanlı Vurgulama**: Kod yazarken anlık syntax highlighting
- **🌐 Çoklu Dil Desteği**: JavaScript, Python, Java, C++ 
- **🔍 Lexical Analyzer**: Token bazlı kod analizi
- **📊 Canlı İstatistikler**: Satır, token ve hata sayacı
- **⚡ Token Listesi**: Tüm tokenların detaylı listesi
- **🎯 Hata Tespiti**: Syntax hatalarının gerçek zamanlı tespiti
- **🎨 Modern UI**: VS Code benzeri dark theme arayüz

## 🖥️ Canlı Demo
[Canlı demo](https://sevdebetul0.github.io/Syntax-Highlighter/)

## 🔗 Medium Makale  
[Makale linki](https://medium.com/@23360859038/gerçek-zamanlı-sözdizimi-vurgulayıcı-ile-web-tabanlı-gui-uygulaması-13a279a68463)

## 📽️ Uygulama Video  
[Video linki](https://youtu.be/Z0l17HFxucA)

## 📋 Desteklenen Diller

| Dil | Durum | 
|-----|-------|
| **JavaScript** | ✅ Tam Destek 
| **Python** | ✅ Tam Destek 
| **Java** | ✅ Tam Destek 
| **C++** | ✅ Tam Destek 

## 🎯 Proje Yapısı

```
├── index.html              # Ana HTML dosyası
├── styles.css              # Stil dosyaları (VS Code teması)
├── main.js                 # Ana uygulama mantığı
├── lexical-analyzer.js     # Lexical Analyzer sınıfı
├── syntax-highlighter.js   # Syntax highlighting engine
├── syntax-parser.js        # AST Parser
└── README.md              # Proje dokümantasyonu
```

## 🔧 Teknik Detaylar

### Lexical Analyzer
- **Token Types**: KEYWORD, STRING, NUMBER, IDENTIFIER, OPERATOR, BRACKET, COMMENT
- **Error Handling**: Bilinmeyen karakterler için hata yönetimi
- **Position Tracking**: Satır ve sütun numarası takibi

### Syntax Parser
- **AST Generation**: Abstract Syntax Tree oluşturma
- **Grammar Rules**: Programlama dili kuralları
- **Error Recovery**: Hata durumunda devam etme

### Highlighting Engine
- **Real-time Processing**: Anlık kod vurgulama
- **Overlay System**: Textarea üzerinde HTML overlay
- **Scroll Sync**: Editör ve vurgulama senkronizasyonu
## 🧪Örnek Uygulama
![Ekran görüntüsü 2025-06-06 142149](https://github.com/user-attachments/assets/ae07e7fd-9b02-4d75-852d-ae2bbf25d085)

![Ekran görüntüsü 2025-06-06 142335](https://github.com/user-attachments/assets/ee904017-123e-418b-94f0-a6db428ec20b)

## 🎯 Kullanım

1. **Dil Seçimi**: Üst menüden programlama dilini seçin
2. **Kod Yazma**: Sol paneldeki editöre kodunuzu yazın
3. **Analiz**: Sağ panelde tokenları, parse tree'yi ve istatistikleri görün
4. **Hata Takibi**: Syntax hataları otomatik olarak işaretlenir

## 🎨 Tema Özelleştirmesi
 Renkleri değiştirmek için `styles.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
    --bg-primary: #1e1e1e;
    --bg-secondary: #252526;
    --text-primary: #d4d4d4;
    --accent-blue: #569cd6;
    --accent-red: #d73a49;
}
```
