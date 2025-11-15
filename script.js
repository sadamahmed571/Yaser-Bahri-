 
// ====== الإعدادات والمتغيرات الأساسية ======
const DESIGNS_CONTAINER_ID = 'designs-grid';
const COLOR_MODAL_ID = 'color-modal';
const BACK_BUTTON_ID = 'back-btn';
const CONFIRM_BUTTON_ID = 'confirm-btn';
const SAVE_BUTTON_ID = 'save-btn';
const RESET_BUTTON_ID = 'reset-btn';
const PREVIEW_STATUS_ID = 'preview-status';
const PREVIEW_NUMBER_ID = 'preview-number';
const PREVIEW_IMAGE_ID = 'preview-image';
const WHATSAPP_NUMBER = '+967777967272';

let currentDesignId = null;
let currentPreviewDesign = null;     // ← جديد
let currentPreviewVersion = null;    // ← جديد

const VERSIONS = ['-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10'];

const arabicPatternOrdinals = {
    1: 'الأولى', 2: 'الثانية', 3: 'الثالثة', 4: 'الرابعة', 5: 'الخامسة',
    6: 'السادسة', 7: 'السابعة', 8: 'الثامنة', 9: 'التاسعة', 10: 'العاشرة',
    11: 'الحادية عشرة', 12: 'الثانية عشرة', 13: 'الثالثة عشرة', 14: 'الرابعة عشرة',
    15: 'الخامسة عشرة', 16: 'السادسة عشرة'
};

const arabicVersionOrdinals = {
    1: 'الأول', 2: 'الثاني', 3: 'الثالث', 4: 'الرابع', 5: 'الخامس',
    6: 'السادس', 7: 'السابع', 8: 'الثامن', 9: 'التاسع', 10: 'العاشر'
};

// دالة إرسال الملاحظات عبر واتساب (تُستخدم في كل الأزرار)
function sendNotesToWhatsApp(designId, versionNum) {
    const patternOrdinal = arabicPatternOrdinals[designId] || designId;
    const versionOrdinal = arabicVersionOrdinals[versionNum] || versionNum;

    const messageText = `______________\n.\n.\n.\n.\n.\n
.
.
.
.
.
في النقشة ${patternOrdinal} (${designId}) الاصدار ${versionOrdinal} (${versionNum}) ..  بإسم (${designId}-${versionNum}.jpg) قم بالتعديلات التي ستسمعها في تسجيل صوتي بعد هذه الرسالة`;

    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // ... (كل الكود السابق موجود كما هو)

    // تحميل الإصدارات الافتراضية للنقشة 1
    loadVersionsForDesign(1);

    // ربط الـ select لتغيير النقشة
    document.getElementById('main-design-number').addEventListener('change', (e) => {
        const selectedDesignId = e.target.value;
        loadVersionsForDesign(selectedDesignId);
    });

    // أزرار التنقل في نافذة المعاينة المنبثقة
    document.getElementById('prev-version-btn').addEventListener('click', () => {
        if (currentPreviewVersion > 1) {
            currentPreviewVersion--;
            document.getElementById('version-previewed-image').src = `ready-versions/${currentPreviewDesign}-${currentPreviewVersion}.jpg`;
        }
    });

    document.getElementById('next-version-btn').addEventListener('click', () => {
        if (currentPreviewVersion < 10) {
            currentPreviewVersion++;
            document.getElementById('version-previewed-image').src = `ready-versions/${currentPreviewDesign}-${currentPreviewVersion}.jpg`;
        }
    });

    // زر "ملاحظات" في نافذة المعاينة المنبثقة
    document.getElementById('notes-btn-modal').addEventListener('click', () => {
        sendNotesToWhatsApp(currentPreviewDesign, currentPreviewVersion);
    });
});

// ==========================================================
// وظيفة تحميل الإصدارات ديناميكياً لنقشة محددة (معدلة)
// ==========================================================

function loadVersionsForDesign(designId) {
    const grid = document.getElementById('designs-grid2');
    grid.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'design-container2';
    container.dataset.designId = designId;

    const rightDiv = document.createElement('div');
    rightDiv.className = 'design-right2';

    const mainImageDiv = document.createElement('div');
    mainImageDiv.className = 'design-main-image2';
    const mainImg = document.createElement('img');
    mainImg.src = `img/${designId}.jpg`;
    mainImg.alt = `${designId}`;
    mainImageDiv.appendChild(mainImg);

    const metaDiv = document.createElement('div');
    metaDiv.className = 'design-meta2';
    const idDiv = document.createElement('div');
    idDiv.className = 'design-id2';
    idDiv.textContent = `النقشة : ${designId}`;
    const colorsNumberDiv = document.createElement('div');
    colorsNumberDiv.className = 'design-colors-number2';
    colorsNumberDiv.textContent = 'عدد النقشات الملونة الجاهزة';
    metaDiv.appendChild(idDiv);
    metaDiv.appendChild(colorsNumberDiv);

    rightDiv.appendChild(mainImageDiv);
    rightDiv.appendChild(metaDiv);

    const leftDiv = document.createElement('div');
    leftDiv.className = 'design-left2';

    const versionsRows = document.createElement('div');
    versionsRows.className = 'versions-rows2';

    const row1 = document.createElement('div');
    row1.className = 'versions-row2';
    const row2 = document.createElement('div');
    row2.className = 'versions-row2';

    for (let i = 1; i <= 10; i++) {
        const versionItem = document.createElement('div');
        versionItem.className = 'version-item2';

        const versionImageDiv = document.createElement('div');
        versionImageDiv.className = 'version-image2';
        const versionImg = document.createElement('img');
        versionImg.src = `ready-versions/${designId}-${i}.jpg`;
        versionImg.alt = `${designId}-${i}`;
        versionImageDiv.appendChild(versionImg);

        const versionNameDiv = document.createElement('div');
        versionNameDiv.className = 'version-name2';
        versionNameDiv.textContent = `${designId}-${i}`;

        const viewButton = document.createElement('button');
        viewButton.className = 'version-view-button2';
        viewButton.title = 'معاينة مكبرة';
        viewButton.textContent = 'معاينة';

        // زر ملاحظات بدل زر الاعتماد
        const notesButton = document.createElement('button');
        notesButton.className = 'design-button notes-btn';
        notesButton.textContent = 'ملاحظات';
        notesButton.addEventListener('click', () => sendNotesToWhatsApp(designId, i));

        // زر المعاينة يحدد التصميم والإصدار الحالي في المودال
        viewButton.addEventListener('click', (e) => {
            const item = e.target.closest('.version-item2');
            const imgSrc = item.querySelector('.version-image2 img').src;
            const fileName = imgSrc.split('/').pop();
            const baseName = fileName.split('.jpg')[0];
            const parts = baseName.split('-');
            currentPreviewDesign = parts[0];
            currentPreviewVersion = parseInt(parts[1]);

            document.getElementById('version-previewed-image').src = imgSrc;
            document.getElementById('version-preview-modal').style.display = 'flex';
        });

        versionItem.appendChild(versionImageDiv);
        versionItem.appendChild(versionNameDiv);
        versionItem.appendChild(viewButton);
        versionItem.appendChild(notesButton);

        if (i <= 5) {
            row1.appendChild(versionItem);
        } else {
            row2.appendChild(versionItem);
        }
    }

    versionsRows.appendChild(row1);
    versionsRows.appendChild(row2);
    leftDiv.appendChild(versionsRows);

    container.appendChild(rightDiv);
    container.appendChild(leftDiv);
    grid.appendChild(container);
}
 