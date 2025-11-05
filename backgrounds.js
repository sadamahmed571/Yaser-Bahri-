// مجموعات ألوان متخصصة للأقمشة والملابس (مرتبة حسب التدرج من الفاتح إلى الداكن)
const fabricColorPalette = {
    // 👖 ألوان الدنيم (Denim Colors) - 15 تدرج
    denim: [
        "#f8fbff", // Extra Light Denim
        "#ebf5fb", // Lightest Denim Wash
        "#e1f0fa", // Very Light Denim
        "#d6eaf8", // Sky Wash
        "#c8e3f6", // Light Stone Washed
        "#aed6f1", // Stone Washed
        "#9bc9eb", // Medium Stone Washed
        "#85c1e9", // Faded Blue
        "#70bae6", // Light Classic Denim
        "#5dade2", // Medium Denim Blue
        "#4a9fde", // Denim Blue
        "#3498db", // Classic Denim
        "#2e86c1", // Dark Denim
        "#2874a6", // Vintage Indigo
        "#21618c", // Raw Denim
        "#1c4c6e", // Deep Indigo
        "#153a57"  // Darkest Indigo
    ],

    // 🧶 ألوان الصوف (Wool Colors) - 15 تدرج
    wool: [
        "#ffffff", // Pure White Wool
        "#fdfefe", // Natural Wool White
        "#fbfcfc", // Cream Wool
        "#f9fafa", // Off-White Wool
        "#f7f9f9", // Light Gray Wool
        "#f4f6f7", // Oatmeal Gray
        "#f2f3f4", // Medium Gray Wool
        "#f0f3f4", // Dark Gray
        "#edf2f7", // Heather Gray
        "#e5e8e8", // Light Silver
        "#d5dbdb", // Silver Mist
        "#c8d0d0", // Medium Silver
        "#babecc", // Slate Wool
        "#a6aab5", // Dark Slate Wool
        "#8e929c", // Charcoal Wool
        "#757983"  // Deep Wool Gray
    ],

    // 🎀 ألوان الحرير (Silk Colors) - 15 تدرج
    silk: [
        "#fffef5", // Pure Silk White
        "#fef9e7", // Silk White
        "#fcf7e1", // Light Ivory
        "#f2f4e3", // Ivory Silk
        "#fcf3cf", // Cream Silk
        "#f9e79f", // Champagne Gold
        "#f7dc6f", // Light Gold Sheen
        "#f5d55f", // Medium Gold
        "#f4d03f", // Rich Silk Gold
        "#f2c94c", // Bright Gold
        "#f1c40f", // Bright Marigold
        "#e6b80f", // Marigold
        "#d4ac0d", // Dark Gold
        "#b7950b", // Deep Silk Bronze
        "#9a7d0a", // Vintage Silk Yellow
        "#7d6608"  // Dark Bronze
    ],

    // 👔 ألوان القطن (Cotton Colors) - 15 تدرج
    cotton: [
        "#ffffff", // Pure White Cotton
        "#fafafa", // Pure Cotton White
        "#f5f5f5", // Natural Cotton
        "#f0f0f0", // Light Washed Cotton
        "#eeeeee", // Washed Cotton Gray
        "#e0e0e0", // Light Cotton
        "#d6d6d6", // Medium Light Cotton
        "#bdbdbd", // Medium Cotton Gray
        "#a7c0af", // Sage Green Cotton
        "#9e9e9e", // Gray Cotton
        "#8c8c8c", // Medium Dark Cotton
        "#757575", // Dark Cotton
        "#616161", // Charcoal Cotton
        "#4a4a4a", // Deep Charcoal
        "#424242", // Deep Cotton Black
        "#212121"  // Jet Black Cotton
    ],

    // 🧥 ألوان المعاطف (Coat Colors) - 15 تدرج
    coat: [
        "#a57c52", // Light Cocoa Brown
        "#8b4513", // Cocoa Brown Coat
        "#7a3d10", // Medium Cocoa
        "#665d1e", // Olive Drab Coat
        "#5a5218", // Dark Olive
        "#512e5f", // Plum Coat
        "#482858", // Dark Plum
        "#4a235a", // Deep Purple Coat
        "#3d1c4a", // Very Deep Purple
        "#34495e", // Dark Blue Coat
        "#2c3e50", // Classic Navy Coat
        "#253342", // Darker Navy
        "#1b4f72", // Navy Blue Coat
        "#154360", // Deep Navy Coat
        "#0e6251", // Forest Green Coat
        "#145a32", // Hunter Green Coat
        "#0d4023", // Dark Forest Green
        "#2c2c2c"  // Black Coat
    ],

    // 🌿 ألوان الكتان (Linen Colors) - 15 تدرج
    linen: [
        "#fffff8", // Pure Linen White
        "#fffaf0", // Linen White
        "#fefce8", // Light Natural
        "#f5f5dc", // Natural Beige
        "#f0f0d8", // Light Beige
        "#eedd82", // Light Goldenrod
        "#e6d8ad", // Khaki
        "#e0d0a0", // Light Khaki
        "#d2b48c", // Burlywood
        "#c9b17a", // Medium Burlywood
        "#c2b280", // Sand
        "#b0c4de", // Light Steel Blue
        "#9db4d4", // Medium Steel Blue
        "#87cefa", // Light Sky Blue
        "#778899", // Light Slate Gray
        "#6a5acd", // Slate Blue
        "#5d4fbb"  // Dark Slate Blue
    ],

    // 🧤 ألوان الجلد والشمواه (Suede/Leather Colors) - 15 تدرج
    suedeLeather: [
        "#d4a574", // Light Tan Suede
        "#cd853f", // Peru Red
        "#c17a3a", // Medium Peru
        "#b8860b", // Dark Goldenrod
        "#b48866", // Taupe Suede
        "#a87c5a", // Medium Taupe
        "#a0522d", // Sienna Brown
        "#8f4a25", // Dark Sienna
        "#996515", // Antique Bronze
        "#8b4513", // Saddle Brown
        "#7a3d10", // Dark Saddle
        "#800000", // Oxblood
        "#6f0000", // Dark Oxblood
        "#704214", // Sepia Brown
        "#5f4323", // Deep Chocolate Brown
        "#4f2c0f", // Dark Suede
        "#3f220c"  // Very Dark Suede
    ],

    // 👑 ألوان المخمل (Velvet Colors) - 15 تدرج
    velvet: [
        "#e6c200", // Light Golden Rod
        "#daa520", // Golden Rod
        "#c8951c", // Dark Golden Rod
        "#ff1493", // Deep Pink
        "#e01282", // Medium Deep Pink
        "#708090", // Slate Gray Velvet
        "#657585", // Dark Slate Gray
        "#8a2be2", // Blue Violet
        "#7a26c7", // Dark Blue Violet
        "#4b0082", // Indigo Royal
        "#3d006b", // Dark Indigo
        "#483d8b", // Dark Slate Blue
        "#3a316e", // Very Dark Slate Blue
        "#000080", // Deep Navy
        "#000066", // Darker Navy
        "#8b008b", // Dark Magenta
        "#006400", // Dark Forest Green
        "#5c0000", // Velvet Red
        "#800000"  // Maroon Deep
    ],

    // 👚 ألوان قماش الجيرسيه (Jersey Knit Colors) - 15 تدرج
    jerseyKnit: [
        "#fffef9", // Pure Jersey White
        "#fdf5e6", // Old Lace
        "#fcf4e8", // Light Lace
        "#f0f8ff", // Alice Blue
        "#e8f4ff", // Light Alice Blue
        "#f0fff0", // Honeydew
        "#e8ffe8", // Light Honeydew
        "#ffe4e1", // Misty Rose
        "#ffdbd8", // Light Misty Rose
        "#e6e6fa", // Lavender
        "#dddafa", // Light Lavender
        "#b0e0e6", // Powder Blue
        "#9fd6dc", // Light Powder Blue
        "#afeeee", // Pale Turquoise
        "#98fb98", // Pale Green
        "#88eb88", // Light Pale Green
        "#add8e6", // Light Blue
        "#ffa07a", // Light Salmon
        "#f08080"  // Light Coral
    ],

    // 🧵 ألوان الترتان/البلايد (Tartan/Plaid Colors) - 15 تدرج
    tartanPlaid: [
        "#fff200", // Bright Gold
        "#ffd700", // Gold
        "#e6c200", // Dark Gold
        "#ff4500", // Orange Red
        "#e63d00", // Dark Orange Red
        "#dc143c", // Crimson Red
        "#c51236", // Dark Crimson
        "#b03060", // Deep Ruby
        "#9c2a54", // Dark Ruby
        "#a52a2a", // Brown
        "#8b0000", // Dark Red
        "#7a0000", // Very Dark Red
        "#4682b4", // Steel Blue
        "#3e74a0", // Dark Steel Blue
        "#5f9ea0", // Cadet Blue
        "#228b22", // Forest Green
        "#1c7a1c", // Dark Forest Green
        "#00008b", // Dark Blue
        "#000000"  // Black
    ],

    // 🌫️ ألوان التويد (Tweed Colors) - 15 تدرج
    tweed: [
        "#e0e0e0", // Light Silver Tweed
        "#c0c0c0", // Silver Tweed
        "#a8a8a8", // Dark Silver
        "#d2b48c", // Tan
        "#c9a87a", // Light Tan
        "#cd853f", // Peru Brown
        "#b57638", // Dark Peru
        "#a9a9a9", // Dark Gray Tweed
        "#8b4513", // Saddle Brown
        "#7a3d10", // Dark Saddle
        "#a52a2a", // Rusty Brown
        "#8f2424", // Dark Rust
        "#808000", // Olive Dark
        "#6b8e23", // Olive Drab
        "#5d7a1e", // Dark Olive Drab
        "#7b68ee", // Medium Slate Blue
        "#6a58d4", // Dark Slate Blue
        "#556b2f", // Dark Olive Green
        "#36454F"  // Charcoal Gray
    ]
};

// العناصر الرئيسية
const mainDesignSelect = document.getElementById('main-design-select');
const previewImage = document.getElementById('assistant-preview-image');
const colorPalette = document.getElementById('color-palette');
const imageDisplay = document.getElementById('image-display');
const customColorBtn = document.getElementById('custom-color-btn');
const customColorPicker = document.getElementById('custom-color-picker');
const confirmBackgroundBtn = document.getElementById('confirm-background-btn');
// الإضافات الجديدة
const borderColorPicker = document.getElementById('border-color-picker');
const patternColorPicker = document.getElementById('pattern-color-picker');

// متغير لتخزين اللون المختار للخلفية
let selectedColor = '';

// إنشاء لوحة الألوان
function createColorPalette() {
    for (const colorGroup in fabricColorPalette) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'color-group';

        const groupTitle = document.createElement('h4');
        // تحويل اسم المجموعة إلى عربي - تم إزالة الإدخالات غير الموجودة في لوحة الألوان
        const groupNames = {
            denim: '👖 ألوان الدنيم',
            wool: '🧶 ألوان الصوف',
            silk: '🎀 ألوان الحرير',
            cotton: '👔 ألوان القطن',
            coat: '🧥 ألوان المعاطف',
            linen: '🌿 ألوان الكتان',
            suedeLeather: '🧤 ألوان الجلد/الشمواه',
            velvet: '👑 ألوان المخمل',
            jerseyKnit: '👚 ألوان قماش الجيرسيه',
            tartanPlaid: '🧵 ألوان الترتان/البلايد',
            tweed: '🌫️ ألوان التويد'
        };

        groupTitle.textContent = groupNames[colorGroup] || colorGroup;
        groupDiv.appendChild(groupTitle);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'color-buttons';

        fabricColorPalette[colorGroup].forEach(color => {
            const colorButton = document.createElement('button');
            colorButton.className = 'color-button';
            colorButton.style.backgroundColor = color;
            colorButton.dataset.color = color;

            colorButton.addEventListener('click', function() {
                selectColor(color);
            });

            buttonsContainer.appendChild(colorButton);
        });

        groupDiv.appendChild(buttonsContainer);
        colorPalette.appendChild(groupDiv);
    }
}

// تحديد لون للخلفية
function selectColor(color) {
    selectedColor = color;
    imageDisplay.style.backgroundColor = color;

    // إزالة التحديد من جميع الأزرار
    document.querySelectorAll('.color-button').forEach(btn => {
        btn.classList.remove('selected');
    });

    // إضافة التحديد للزر المختار
    const selectedButton = document.querySelector(`.color-button[data-color="${color}"]`);
    if (selectedButton) {
        selectedButton.classList.add('selected');
    }
}

// تغيير الصورة بناءً على التحديد
function changeImage() {
    const selectedValue = mainDesignSelect.value;
    previewImage.src = `backgrounds/${selectedValue}.png`;
}

// إرسال الرسالة عبر واتساب (تم التعديل)
function sendWhatsAppMessage() {
    if (!selectedColor) {
        alert('يرجى اختيار لون خلفية أولاً');
        return;
    }

    const designNumber = mainDesignSelect.value;
    const borderColor = borderColorPicker.value; // القيمة الجديدة للون الحاشية
    const patternColor = patternColorPicker.value; // القيمة الجديدة للون النقشة

    let message = `اعتمد هذا اللون [${selectedColor}] كخلفية للنقشة رقم (${designNumber})`;

    // إضافة لون الحاشية إذا لم يكن أسود (القيمة الافتراضية)
    if (borderColor !== '#000000') {
        message += `\n**لون الحاشية المطلوب:** [${borderColor}]`;
    }

    // إضافة لون النقشة إذا لم يكن أسود (القيمة الافتراضية)
    if (patternColor !== '#000000') {
        message += `\n**لون النقشة المطلوب:** [${patternColor}]`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/967777967272?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}

// تهيئة الصفحة
function init() {
    // إنشاء لوحة الألوان
    createColorPalette();

    // إضافة مستمع حدث لتغيير التصميم
    mainDesignSelect.addEventListener('change', changeImage);

    // إضافة مستمع حدث لزر اللون المخصص
    customColorBtn.addEventListener('click', function() {
        customColorPicker.click();
    });

    customColorPicker.addEventListener('change', function() {
        selectColor(this.value);
    });

    // إضافة مستمع حدث لزر التأكيد والإرسال
    confirmBackgroundBtn.addEventListener('click', sendWhatsAppMessage);

    // تحميل الصورة الأولى عند التحميل
    changeImage();
}

// تشغيل التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', init);