        // JavaScript هنا
        document.addEventListener('DOMContentLoaded', function() {
            // بيانات التصاميم - محاكاة للبيانات الحقيقية
            const designsData = [];
            for (let i = 1; i <= 60; i++) {
                // محاكاة عدد الإصدارات المتاحة لكل تصميم
                let availableVersions = 0;
                if (i <= 5) {
                    // أول 5 تصميمات لديها إصدارات مختلفة
                    availableVersions = Math.min(10, Math.floor(Math.random() * 11));
                } else if (i <= 10) {
                    // التصاميم من 6 إلى 10 لديها إصدارات أقل
                    availableVersions = Math.min(5, Math.floor(Math.random() * 6));
                } else {
                    // بقية التصاميم إما 0 أو 1 إصدار
                    availableVersions = Math.random() > 0.7 ? 1 : 0;
                }
                
                designsData.push({
                    id: i,
                    name: `تصميم ${i}`,
                    image: i <= 10 ? `ready/${i}.jpg` : '', // أول 10 تصميمات لها صور رئيسية
                    availableVersions: availableVersions,
                    versions: []
                });
                
                // إنشاء بيانات الإصدارات للتصاميم التي لديها إصدارات
                if (availableVersions > 0) {
                    const versionLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
                    for (let j = 0; j < availableVersions; j++) {
                        designsData[i-1].versions.push({
                            letter: versionLetters[j],
                            image: `ready/${i}${versionLetters[j]}.jpg`,
                            status: Math.random() > 0.5 ? 'جاهز' : 'قيد التنفيذ'
                        });
                    }
                }
            }

            // العناصر الأساسية في DOM
            const designsGrid = document.getElementById('designs-grid');
            const versionsSection = document.getElementById('versions-section');
            const versionsTitle = document.getElementById('versions-title');
            const selectedDesignNumber = document.getElementById('selected-design-number');
            const versionsGrid = document.getElementById('versions-grid');
            const backToDesignsBtn = document.getElementById('back-to-designs');
            const readyCountElem = document.getElementById('ready-count');
            const completedCountElem = document.getElementById('completed-count');

            let selectedDesignId = null;

            // إنشاء شبكة التصاميم
            function renderDesignsGrid() {
                designsGrid.innerHTML = '';
                
                designsData.forEach(design => {
                    const designContainer = document.createElement('div');
                    designContainer.className = 'design-container';
                    designContainer.dataset.designId = design.id;
                    
                    const designInfo = document.createElement('div');
                    designInfo.className = 'design-info';
                    
                    const designNumber = document.createElement('div');
                    designNumber.className = 'design-number';
                    designNumber.textContent = design.id;
                    
                    const versionCount = document.createElement('div');
                    versionCount.className = 'version-count';
                    versionCount.textContent = `عدد الاصدارات الجاهزة: ${design.availableVersions}`;
                    
                    designInfo.appendChild(designNumber);
                    designInfo.appendChild(versionCount);
                    
                    const designImage = document.createElement('div');
                    designImage.className = 'design-image';
                    
                    if (design.image) {
                        const img = document.createElement('img');
                        img.src = design.image;
                        img.alt = design.name;
                        designImage.appendChild(img);
                    } else {
                        designImage.textContent = 'لا توجد صورة رئيسية';
                    }
                    
                    designContainer.appendChild(designInfo);
                    designContainer.appendChild(designImage);
                    
                    designContainer.addEventListener('click', () => {
                        showDesignVersions(design.id);
                    });
                    
                    designsGrid.appendChild(designContainer);
                });
                
                updateStats();
            }

            // عرض إصدارات التصميم المحدد
            function showDesignVersions(designId) {
                selectedDesignId = designId;
                const design = designsData[designId - 1];
                
                selectedDesignNumber.textContent = design.id;
                versionsTitle.textContent = `الإصدارات للتصميم ${design.id}`;
                
                renderVersionsGrid(design);
                
                versionsSection.classList.add('active');
                
                // التمرير إلى قسم الإصدارات
                versionsSection.scrollIntoView({ behavior: 'smooth' });
            }

            // إنشاء شبكة الإصدارات
            function renderVersionsGrid(design) {
                versionsGrid.innerHTML = '';
                
                if (design.versions.length === 0) {
                    const noVersionsMsg = document.createElement('div');
                    noVersionsMsg.className = 'no-versions';
                    noVersionsMsg.textContent = 'لا توجد إصدارات جاهزة لهذا التصميم بعد';
                    noVersionsMsg.style.gridColumn = '1 / -1';
                    noVersionsMsg.style.textAlign = 'center';
                    noVersionsMsg.style.padding = '20px';
                    versionsGrid.appendChild(noVersionsMsg);
                    return;
                }
                
                design.versions.forEach(version => {
                    const versionContainer = document.createElement('div');
                    versionContainer.className = 'version-container';
                    
                    const versionImage = document.createElement('div');
                    versionImage.className = 'version-image';
                    
                    const img = document.createElement('img');
                    img.src = version.image;
                    img.alt = `الإصدار ${version.letter} للتصميم ${design.id}`;
                    versionImage.appendChild(img);
                    
                    const versionInfo = document.createElement('div');
                    versionInfo.className = 'version-info';
                    
                    const versionName = document.createElement('div');
                    versionName.className = 'version-name';
                    versionName.textContent = `الإصدار ${version.letter}`;
                    
                    const versionStatus = document.createElement('div');
                    versionStatus.className = 'version-status';
                    versionStatus.textContent = version.status;
                    
                    versionInfo.appendChild(versionName);
                    versionInfo.appendChild(versionStatus);
                    
                    versionContainer.appendChild(versionImage);
                    versionContainer.appendChild(versionInfo);
                    
                    versionsGrid.appendChild(versionContainer);
                });
            }

            // تحديث الإحصائيات
            function updateStats() {
                // محاكاة لحساب التصاميم الجاهزة بدون ألوان
                const readyCount = designsData.filter(design => design.image !== '').length;
                
                // محاكاة لحساب التصاميم الجاهزة كلياً (التي لديها 10 إصدارات)
                const completedCount = designsData.filter(design => design.availableVersions === 10).length;
                
                readyCountElem.textContent = readyCount;
                completedCountElem.textContent = completedCount;
            }

            // العودة إلى قائمة التصاميم
            backToDesignsBtn.addEventListener('click', function() {
                versionsSection.classList.remove('active');
                
                // التمرير إلى أعلى الصفحة
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // تهيئة التطبيق
            renderDesignsGrid();
        });