        // JavaScript هنا
        document.addEventListener('DOMContentLoaded', function() {
            // بيانات التصاميم
            const designsData = [];
            for (let i = 1; i <= 60; i++) {
                designsData.push({
                    id: i,
                    name: `تصميم ${i}`,
                    image: i <= 5 ? `img/${i}.jpg` : '', // فقط أول 5 تصميمات لها صور
                    colors: {
                        a: { background: '', pattern: '', edges: '' },
                        b: { background: '', pattern: '', edges: '' },
                        c: { background: '', pattern: '', edges: '' },
                        d: { background: '', pattern: '', edges: '' },
                        e: { background: '', pattern: '', edges: '' },
                        f: { background: '', pattern: '', edges: '' },
                        g: { background: '', pattern: '', edges: '' },
                        h: { background: '', pattern: '', edges: '' },
                        i: { background: '', pattern: '', edges: '' },
                        j: { background: '', pattern: '', edges: '' }
                    },
                    status: 'not-selected' // not-selected, selected, sent
                });
            }

            // تحميل البيانات المحفوظة من localStorage
            const savedData = localStorage.getItem('designsData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                parsedData.forEach((design, index) => {
                    if (index < designsData.length) {
                        designsData[index].colors = design.colors;
                        designsData[index].status = design.status;
                    }
                });
            }

            // العناصر الأساسية في DOM
            const designsGrid = document.getElementById('designs-grid');
            const colorModal = document.getElementById('color-modal');
            const colorVersions = document.getElementById('color-versions');
            const previewNumber = document.getElementById('preview-number');
            const previewStatus = document.getElementById('preview-status');
            const previewImage = document.getElementById('preview-image');
            const confirmBtn = document.getElementById('confirm-btn');
            const saveBtn = document.getElementById('save-btn');
            const resetBtn = document.getElementById('reset-btn');
            const backBtn = document.getElementById('back-btn');

            let currentDesignId = null;

            // إنشاء شبكة التصاميم
            function renderDesignsGrid() {
                designsGrid.innerHTML = '';
                
                designsData.forEach(design => {
                    const designContainer = document.createElement('div');
                    designContainer.className = 'design-container';
                    
                    const designInfo = document.createElement('div');
                    designInfo.className = 'design-info';
                    
                    const designNumber = document.createElement('div');
                    designNumber.className = 'design-number';
                    designNumber.textContent = design.id;
                    
                    const designButton = document.createElement('button');
                    designButton.className = 'design-button';
                    designButton.textContent = design.status === 'not-selected' ? 
                        'قم باختيار الالوان لهذه النقشة' : 'تعديل الوان هذه النقشة';
                    
                    if (design.status !== 'not-selected') {
                        designButton.classList.add('edit');
                    }
                    
                    designButton.addEventListener('click', () => {
                        openColorModal(design.id);
                    });
                    
                    designInfo.appendChild(designNumber);
                    designInfo.appendChild(designButton);
                    
                    const designImage = document.createElement('div');
                    designImage.className = 'design-image';
                    
                    if (design.image) {
                        const img = document.createElement('img');
                        img.src = design.image;
                        img.alt = design.name;
                        designImage.appendChild(img);
                    } else {
                        designImage.textContent = 'لم يتم الانتهاء من التصميم بعد';
                    }
                    
                    designContainer.appendChild(designInfo);
                    designContainer.appendChild(designImage);
                    
                    designsGrid.appendChild(designContainer);
                });
                
                updateStats();
            }

            // فتح نافذة اختيار الألوان
            function openColorModal(designId) {
                currentDesignId = designId;
                const design = designsData[designId - 1];
                
                previewNumber.textContent = design.id;
                previewImage.src = design.image;
                
                // تحديث حالة التصميم
                updateDesignStatus(design);
                
                // إنشاء إصدارات الألوان
                renderColorVersions(design);
                
                colorModal.style.display = 'block';
            }

            // تحديث حالة التصميم
            function updateDesignStatus(design) {
                previewStatus.textContent = 
                    design.status === 'not-selected' ? 'لم يتم الاختيار' :
                    design.status === 'selected' ? 'تم الاختيار' : 'تم الارسال';
                
                previewStatus.className = 'preview-status ' + 
                    (design.status === 'not-selected' ? 'status-not-selected' :
                     design.status === 'selected' ? 'status-selected' : 'status-sent');
            }

            // إنشاء إصدارات الألوان
            function renderColorVersions(design) {
                colorVersions.innerHTML = '';
                
                const versions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
                
                versions.forEach(version => {
                    const versionContainer = document.createElement('div');
                    versionContainer.className = 'version-container';
                    
                    const versionHeader = document.createElement('div');
                    versionHeader.className = 'version-header';
                    versionHeader.textContent = `الاصدار ${version}`;
                    
                    const colorButtons = document.createElement('div');
                    colorButtons.className = 'color-buttons';
                    
                    // زر الخلفية
                    const backgroundBtn = document.createElement('button');
                    backgroundBtn.className = 'color-button';
                    backgroundBtn.textContent = 'الخلفية';
                    backgroundBtn.addEventListener('click', () => {
                        openColorPicker(design.id, version, 'background');
                    });
                    
                    // زر النقشة
                    const patternBtn = document.createElement('button');
                    patternBtn.className = 'color-button';
                    patternBtn.textContent = 'النقشة';
                    patternBtn.addEventListener('click', () => {
                        openColorPicker(design.id, version, 'pattern');
                    });
                    
                    // زر الحواشي
                    const edgesBtn = document.createElement('button');
                    edgesBtn.className = 'color-button';
                    edgesBtn.textContent = 'الحواشي';
                    edgesBtn.addEventListener('click', () => {
                        openColorPicker(design.id, version, 'edges');
                    });
                    
                    colorButtons.appendChild(backgroundBtn);
                    colorButtons.appendChild(patternBtn);
                    colorButtons.appendChild(edgesBtn);
                    
                    const colorDisplay = document.createElement('div');
                    colorDisplay.className = 'color-display';
                    
                    // عرض لون الخلفية
                    const bgColorDisplay = document.createElement('div');
                    bgColorDisplay.className = 'color-display';
                    
                    const bgColorCircle = document.createElement('div');
                    bgColorCircle.className = 'color-circle';
                    bgColorCircle.style.backgroundColor = design.colors[version].background || '#ffffff';
                    
                    const bgColorCode = document.createElement('span');
                    bgColorCode.className = 'color-code';
                    bgColorCode.textContent = design.colors[version].background || '#ffffff';
                    
                    bgColorDisplay.appendChild(bgColorCircle);
                    bgColorDisplay.appendChild(bgColorCode);
                    
                    // عرض لون النقشة
                    const patternColorDisplay = document.createElement('div');
                    patternColorDisplay.className = 'color-display';
                    
                    const patternColorCircle = document.createElement('div');
                    patternColorCircle.className = 'color-circle';
                    patternColorCircle.style.backgroundColor = design.colors[version].pattern || '#000000';
                    
                    const patternColorCode = document.createElement('span');
                    patternColorCode.className = 'color-code';
                    patternColorCode.textContent = design.colors[version].pattern || '#000000';
                    
                    patternColorDisplay.appendChild(patternColorCircle);
                    patternColorDisplay.appendChild(patternColorCode);
                    
                    // عرض لون الحواشي
                    const edgesColorDisplay = document.createElement('div');
                    edgesColorDisplay.className = 'color-display';
                    
                    const edgesColorCircle = document.createElement('div');
                    edgesColorCircle.className = 'color-circle';
                    edgesColorCircle.style.backgroundColor = design.colors[version].edges || '#000000';
                    
                    const edgesColorCode = document.createElement('span');
                    edgesColorCode.className = 'color-code';
                    edgesColorCode.textContent = design.colors[version].edges || '#000000';
                    
                    edgesColorDisplay.appendChild(edgesColorCircle);
                    edgesColorDisplay.appendChild(edgesColorCode);
                    
                    versionContainer.appendChild(versionHeader);
                    versionContainer.appendChild(colorButtons);
                    versionContainer.appendChild(bgColorDisplay);
                    versionContainer.appendChild(patternColorDisplay);
                    versionContainer.appendChild(edgesColorDisplay);
                    
                    colorVersions.appendChild(versionContainer);
                });
            }

            // فتح منتقي الألوان
            function openColorPicker(designId, version, colorType) {
                const design = designsData[designId - 1];
                const currentColor = design.colors[version][colorType] || '#000000';
                
                // إنشاء عنصر input من نوع color مخفي
                const colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.value = currentColor;
                colorInput.style.position = 'fixed';
                colorInput.style.opacity = 0;
                colorInput.style.pointerEvents = 'none';
                
                document.body.appendChild(colorInput);
                
                // فتح منتقي الألوان
                colorInput.click();
                
                // تحديث اللون عند التغيير
                colorInput.addEventListener('input', function() {
                    design.colors[version][colorType] = colorInput.value;
                    renderColorVersions(design);
                    updateDesignStatus(design);
                    saveDataToLocalStorage();
                });
                
                // إزالة عنصر input بعد الاختيار
                setTimeout(() => {
                    document.body.removeChild(colorInput);
                }, 100);
            }

            // تحديث الإحصائيات
            function updateStats() {
                const readyCount = designsData.filter(design => design.image !== '').length;
                const completedCount = designsData.filter(design => design.status === 'sent').length;
                
                document.getElementById('ready-count').textContent = readyCount;
                document.getElementById('completed-count').textContent = completedCount;
            }

            // حفظ البيانات في localStorage
            function saveDataToLocalStorage() {
                const dataToSave = designsData.map(design => ({
                    id: design.id,
                    colors: design.colors,
                    status: design.status
                }));
                
                localStorage.setItem('designsData', JSON.stringify(dataToSave));
            }

            // تأكيد الألوان وإرسالها عبر واتساب
            confirmBtn.addEventListener('click', function() {
                if (!currentDesignId) return;
                
                const design = designsData[currentDesignId - 1];
                design.status = 'sent';
                
                // إنشاء نص الرسالة
                let message = `عزيزي المصمم المبدع صدام .. قم بأعتماد هذه الالوان للتصميم رقم (${design.id}):\n_______________\n`;
                
                const versions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
                
                versions.forEach(version => {
                    message += `-- الاصدار ${version} /\n`;
                    message += `* لون الخلفية : ${design.colors[version].background || '#ffffff'}\n`;
                    message += `* لون النقشة : ${design.colors[version].pattern || '#000000'}\n`;
                    message += `* لون الحواشي : ${design.colors[version].edges || '#000000'}\n`;
                    message += '-----\n';
                });
                
                // ترميز النص للرابط
                const encodedMessage = encodeURIComponent(message);
                
                // إنشاء رابط واتساب
                const whatsappUrl = `https://wa.me/967777967272?text=${encodedMessage}`;
                
                // فتح الرابط في نافذة جديدة
                window.open(whatsappUrl, '_blank');
                
                // تحديث الواجهة
                updateDesignStatus(design);
                renderDesignsGrid();
                saveDataToLocalStorage();
            });

            // حفظ مؤقت
            saveBtn.addEventListener('click', function() {
                if (!currentDesignId) return;
                
                const design = designsData[currentDesignId - 1];
                design.status = 'selected';
                
                updateDesignStatus(design);
                renderDesignsGrid();
                saveDataToLocalStorage();
                
                alert('تم حفظ الألوان مؤقتاً');
            });

            // تصفير الخانات
            resetBtn.addEventListener('click', function() {
                if (!currentDesignId) return;
                
                if (confirm('هل أنت متأكد من أنك تريد مسح جميع الألوان لهذا التصميم؟')) {
                    const design = designsData[currentDesignId - 1];
                    
                    // إعادة تعيين جميع الألوان
                    const versions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
                    versions.forEach(version => {
                        design.colors[version] = { background: '', pattern: '', edges: '' };
                    });
                    
                    design.status = 'not-selected';
                    
                    renderColorVersions(design);
                    updateDesignStatus(design);
                    renderDesignsGrid();
                    saveDataToLocalStorage();
                }
            });

            // العودة إلى صفحة النقشات
            backBtn.addEventListener('click', function() {
                colorModal.style.display = 'none';
            });

            // إغلاق النافذة عند النقر خارجها
            window.addEventListener('click', function(event) {
                if (event.target === colorModal) {
                    colorModal.style.display = 'none';
                }
            });

            // تهيئة التطبيق
            renderDesignsGrid();
        });