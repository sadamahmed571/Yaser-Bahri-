// color_picker.js - منتقي ألوان مخصص كمودال منبثق

const ColorPicker = {
  currentCallback: null, // لإرجاع اللون المختار
  init: function() {
    // إنشاء المودال إذا لم يكن موجوداً (يتم ديناميكياً)
    if (!document.getElementById('custom-color-modal')) {
      const modal = document.createElement('div');
      modal.id = 'custom-color-modal';
      modal.style.display = 'none';
      modal.style.position = 'fixed';
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.background = '#ffffff';
      modal.style.padding = '20px';
      modal.style.border = '1px solid #ddd';
      modal.style.borderRadius = '10px';
      modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      modal.style.zIndex = '10000';
      modal.style.maxWidth = '300px';
      modal.style.textAlign = 'center';

      modal.innerHTML = `
        <h4>اختر اللون</h4>
        <div id="clr-color-preview" style="width: 100px; height: 100px; margin: 0 auto 20px; border: 1px solid #ddd; border-radius: 5px; background: #000000;"></div>
        <div style="margin-bottom: 10px;">
          <label for="redRange">أحمر:</label>
          <input type="range" id="redRange" min="0" max="255" value="0">
          <span id="redValue">0</span>
        </div>
        <div style="margin-bottom: 10px;">
          <label for="greenRange">أخضر:</label>
          <input type="range" id="greenRange" min="0" max="255" value="0">
          <span id="greenValue">0</span>
        </div>
        <div style="margin-bottom: 10px;">
          <label for="blueRange">أزرق:</label>
          <input type="range" id="blueRange" min="0" max="255" value="0">
          <span id="blueValue">0</span>
        </div>
        <button id="confirmColor" style="margin-right: 10px; padding: 8px 16px; background: #4caf50; color: white; border: none; border-radius: 5px;">تأكيد</button>
        <button id="cancelColor" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 5px;">إلغاء</button>
      `;

      document.body.appendChild(modal);

      // تهيئة العناصر داخل المودال
      const redRange = document.getElementById('redRange');
      const greenRange = document.getElementById('greenRange');
      const blueRange = document.getElementById('blueRange');
      const redValue = document.getElementById('redValue');
      const greenValue = document.getElementById('greenValue');
      const blueValue = document.getElementById('blueValue');
      const preview = document.getElementById('clr-color-preview');

      // وظيفة تحديث المعاينة الحية
      const updatePreview = () => {
        const r = redRange.value;
        const g = greenRange.value;
        const b = blueRange.value;
        preview.style.background = `rgb(${r}, ${g}, ${b})`;
        redValue.textContent = r;
        greenValue.textContent = g;
        blueValue.textContent = b;
      };

      redRange.addEventListener('input', updatePreview);
      greenRange.addEventListener('input', updatePreview);
      blueRange.addEventListener('input', updatePreview);

      // زر التأكيد
      document.getElementById('confirmColor').addEventListener('click', () => {
        const r = redRange.value;
        const g = greenRange.value;
        const b = blueRange.value;
        const hex = rgbToHex(r, g, b);
        if (ColorPicker.currentCallback) {
          ColorPicker.currentCallback(hex);
        }
        modal.style.display = 'none';
      });

      // زر الإلغاء
      document.getElementById('cancelColor').addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
  },
  open: function(initialColor, callback) {
    const modal = document.getElementById('custom-color-modal');
    const redRange = document.getElementById('redRange');
    const greenRange = document.getElementById('greenRange');
    const blueRange = document.getElementById('blueRange');

    // تعيين اللون الابتدائي
    let [r, g, b] = hexToRgb(initialColor) || [0, 0, 0];
    redRange.value = r;
    greenRange.value = g;
    blueRange.value = b;

    // تحديث المعاينة فوراً
    const event = new Event('input');
    redRange.dispatchEvent(event);

    ColorPicker.currentCallback = callback;
    modal.style.display = 'block';
  }
};

// وظائف مساعدة للتحويل بين HEX و RGB
function hexToRgb(hex) {
  if (hex === '#N/A' || !hex) return [0, 0, 0];
  hex = hex.replace('#', '');
  if (hex.length !== 6) return [0, 0, 0];
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16)
  ];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
}

// للتهيئة التلقائية إذا أردت، لكن استدعِ ColorPicker.init() يدوياً في السكريبت الرئيسي

