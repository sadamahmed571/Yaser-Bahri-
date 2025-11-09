   // تعريف المتغيرات
    let colorPickerFile;
    let colorPickerDropArea = document.getElementById("colorPickerDropArea");
    let colorPickerBrowseBtn = document.getElementById("colorPickerBrowseBtn");
    let colorPickerImage = document.getElementById("colorPickerImage");
    let colorPickerCanvas = document.getElementById("colorPickerCanvas");
    let colorPickerMagnifier = document.getElementById("colorPickerMagnifier");
    let colorPickerColorPreview = document.getElementById("colorPickerColorPreview");
    let colorPickerColorCode = document.getElementById("colorPickerColorCode");
    let colorPickerModal = document.getElementById("colorPickerModal");
    let closeBtn = document.getElementById("closeBtn");
    let colorPickerConfirmBtn = document.getElementById("colorPickerConfirmBtn");
    let colorPickerThumbnails = document.getElementById("colorPickerThumbnails");
    
    let selectedColorHex = "#FFFFFF";
    let selectedColorRgb = "rgb(255, 255, 255)";
    let activeColorSection = 'background'; // القسم النشط الحالي

    // تهيئة أداة استخراج الألوان
    const initializeColorPicker = () => {
      // إعداد أحداث السحب والإفلات
      ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        colorPickerDropArea.addEventListener(eventName, preventDefaults, false);
      });
      
      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // إبراز منطقة السحب عند السحب فوقها
      ["dragenter", "dragover"].forEach(eventName => {
        colorPickerDropArea.addEventListener(eventName, highlight, false);
      });
      
      ["dragleave", "drop"].forEach(eventName => {
        colorPickerDropArea.addEventListener(eventName, unhighlight, false);
      });
      
      function highlight() {
        colorPickerDropArea.classList.add("highlight");
      }
      
      function unhighlight() {
        colorPickerDropArea.classList.remove("highlight");
      }
      
      // معالجة الملف المسقط
      colorPickerDropArea.addEventListener("drop", handleDroppedFile, false);
      
      // معالجة اختيار الملف
      colorPickerBrowseBtn.addEventListener("change", handleSelectedFile);
      
      // إعداد أحداث منتقي الألوان
      colorPickerImage.addEventListener("mousemove", openEyedropper);
      colorPickerImage.addEventListener("mouseenter", openMagnifier);
      colorPickerImage.addEventListener("mouseout", closeEyedropper);
      colorPickerImage.addEventListener("click", pickColor);
      
      // إغلاق النافذة المنبثقة
      closeBtn.addEventListener("click", closeModal);
      
      // تأكيد اختيار اللون
      colorPickerConfirmBtn.addEventListener("click", confirmColor);
      
      // تحميل الصور المصغرة
      loadThumbnails();
      
      // إعداد أزرار استخراج الألوان في الأقسام المختلفة
      document.querySelectorAll('.extract-color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          activeColorSection = this.dataset.section;
          openModal();
        });
      });
    };
    
    // معالجة الملف المسقط
    const handleDroppedFile = (e) => {
      const dt = e.dataTransfer;
      const file = dt.files[0];
      handleFile(file);
    };
    
    // معالجة اختيار الملف
    const handleSelectedFile = () => {
      const file = colorPickerBrowseBtn.files[0];
      handleFile(file);
    };
    
    // معالجة الملف وعرض الصورة
    const handleFile = (file) => {
      if (file && file.type.match("image.*")) {
        const reader = new FileReader();
        
        reader.addEventListener("load", function() {
          colorPickerImage.src = reader.result;
          resetSelectedColor();
        });
        
        reader.readAsDataURL(file);
      }
    };
    
    // فتح النافذة المنبثقة
    const openModal = () => {
      colorPickerModal.style.display = "block";
    };
    
    // إغلاق النافذة المنبثقة
    const closeModal = () => {
      colorPickerModal.style.display = "none";
    };
    
    // استخدام منتقي الألوان
    const openEyedropper = (e) => {
      const pos = getCursorPos(e);
      const x = pos.x;
      const y = pos.y;
      
      useCanvas(colorPickerCanvas, colorPickerImage, function() {
        const p = colorPickerCanvas.getContext("2d").getImageData(x, y, 1, 1).data;
        colorPickerMagnifier.style.backgroundColor = colorCode(p[0], p[1], p[2]);
      });
    };
    
    // فتح العدسة المكبرة
    const openMagnifier = () => {
      colorPickerMagnifier.style.display = "block";
      
      const moveMagnifier = (e) => {
        const pos = getCursorPos(e);
        const x = pos.x;
        const y = pos.y;
        
        colorPickerMagnifier.style.left = (e.pageX - 50) + "px";
        colorPickerMagnifier.style.top = (e.pageY - 50) + "px";
        
        // تكبير جزء من الصورة داخل العدسة
        const zoom = 2;
        const bgX = -x * zoom + 50;
        const bgY = -y * zoom + 50;
        
        colorPickerMagnifier.style.backgroundImage = `url('${colorPickerImage.src}')`;
        colorPickerMagnifier.style.backgroundSize = `${colorPickerImage.width * zoom}px ${colorPickerImage.height * zoom}px`;
        colorPickerMagnifier.style.backgroundPosition = `${bgX}px ${bgY}px`;
      };
      
      colorPickerImage.addEventListener("mousemove", moveMagnifier);
    };
    
    // إغلاق منتقي الألوان
    const closeEyedropper = () => {
      colorPickerMagnifier.style.display = "none";
    };
    
    // الحصول على موضع المؤشر
    const getCursorPos = (e) => {
      const a = colorPickerImage.getBoundingClientRect();
      const x = e.pageX - a.left - window.pageXOffset;
      const y = e.pageY - a.top - window.pageYOffset;
      return { x: x, y: y };
    };
    
    // استخدام canvas لرسم الصورة
    const useCanvas = (el, img, callback) => {
      el.width = img.width;
      el.height = img.height;
      el.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
      return callback();
    };
    
    // تحويل RGB إلى HEX
    const colorCode = (r, g, b) => {
      function componentToHex(c) {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
      
      selectedColorHex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
      selectedColorRgb = `rgb(${r}, ${g}, ${b})`;
      
      return selectedColorHex;
    };
    
    // اختيار اللون
    const pickColor = () => {
      colorPickerColorPreview.style.backgroundColor = selectedColorHex;
      colorPickerColorCode.textContent = selectedColorHex;
    };
    
    // إعادة تعيين اللون المختار
    const resetSelectedColor = () => {
      selectedColorHex = "#FFFFFF";
      selectedColorRgb = "rgb(255, 255, 255)";
      colorPickerColorPreview.style.backgroundColor = selectedColorHex;
      colorPickerColorCode.textContent = selectedColorHex;
    };
    
    // تأكيد اختيار اللون
    const confirmColor = () => {
      selectNewColor(selectedColorHex, activeColorSection);
      closeModal();
    };
    
    // تحميل الصور المصغرة
    const loadThumbnails = () => {
      // في هذا المثال، سنستخدم صورًا افتراضية
      // في التطبيق الحقيقي، يمكنك استبدالها بصور من مجلد wheels
      const thumbnailUrls = [
        "wheels/wheel2.png",
        "wheels/wheel1.jpg",
        "https://via.placeholder.com/100/3357FF/FFFFFF?text=3",
        "https://via.placeholder.com/100/F333FF/FFFFFF?text=4",
        "https://via.placeholder.com/100/33FFF3/FFFFFF?text=5",
        "https://via.placeholder.com/100/FF33A1/FFFFFF?text=6"
      ];
      
      thumbnailUrls.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        img.className = "color-picker-thumbnail";
        img.addEventListener("click", function() {
          colorPickerImage.src = url;
          resetSelectedColor();
        });
        colorPickerThumbnails.appendChild(img);
      });
    };

    // مجموعات ألوان متخصصة للأقمشة والملابس (مرتبة حسب التدرج من الفاتح إلى الداكن)
    const fabricColorPalette = {
        // ... (نفس المحتوى السابق) ...
    };

    // قوائم الألوان الجديدة
    const colorLists = {

"your-colors": [
            "#14191c", "#17223e", "#1a2423", "#4e0e18", "#663b3d", "#17373e", "#2a2a28", "#2c1821", "#2d3b2e", "#787f69",
            "#3e2a3e", "#2a3d3e", "#35241c", "#371418", "#3b3b3d", "#2a3e32", "#3e2c2a", "#1c2b41", "#15386a", "#28311b",
            "#164555", "#4b6353", "#4d515d", "#50252c", "#37471f", "#38291e", "#867441", "#563a2c", "#1c3329", "#164b35",
            "#969697", "#3d2232", "#66503b", "#673212", "#332e1b", "#2b273f", "#6c7f69", "#5c7a54", "#5b2b28", "#75573b",
            "#8fa074", "#4e4438", "#cbb6a9", "#465e46", "#c9aa97", "#7d7d63", "#434542", "#a29a85", "#cdc7b7", "#e1c19b",
            "#8f7a5d", "#a1a08b", "#ad8d54", "#ba9e5f", "#bc7b65", "#bab774", "#ded2a8", "#a3a880", "#916d5f", "#463a2a",
            "#6ca379"
        ],
        
        "your-palette": [
            "#071925", "#412823", "#573d56", "#3b454e", "#3f4541", "#45484d", "#4a4542", "#4a495a", "#5d4835", "#5f5a57",
            "#595c61", "#606c78", "#615957", "#626747", "#633e35", "#63734e", "#676d69", "#6a7c62", "#6b6e75", "#6b7076",
            "#724f31", "#736b69", "#74382e", "#777f5a", "#794b8b", "#794e3d", "#7f8289", "#80838c", "#832943", "#877f7d",
            "#893626", "#899ac6", "#915a3c", "#914f39", "#9198a0", "#937539", "#9d9592", "#a3a9b7", "#a4b392", "#a69fd2",
            "#a9a335", "#ab1a58", "#afa5a3", "#afa5a4", "#b0b3a0", "#b5a281", "#b8bac6", "#b9a44b", "#bbc3ce", "#bd6da0",
            "#bec4c2", "#c3b9b8", "#c4842d", "#c8835c", "#c8a771", "#c98b7d", "#ccbdde", "#d1bb92", "#d2e1f6", "#d4bfa4",
            "#d7ccc8", "#d7e1e3", "#d9be82", "#da97c2", "#dbba98", "#dbc4ad", "#dccb93", "#ddc4ad", "#dfc5e0", "#e29e7b",
            "#e47a62", "#e4dad9", "#e6bfce", "#e6e1a7", "#e7b3c0", "#ed3d86", "#f599b2", "#f3ebe9", "#fff5df"
        ],
        
        "gradients": {
            " ": ["#122139", "#192538", "#253955", "#304a6f", "#3e5e8d", "#4e75ae", "#5d8bcd", "#6da2ee", "#d6dbd0"],
			
			  "الأخضر المصفر": ["#133d02", "#154d1b", "#23672a", "#357d3c", "#54965a", "#74b77a", "#98cd9d", "#aed8c6", "#cbd9d3"],
			
            "3الأخضر الفاتح": ["#1b270b", "#2e4015", "#445a24", "#597234", "#748a54", "#90a078", "#aebf96", "#cdd6c1", "#d6dbcf"],
			
          
			
            "الأصفر": ["#373018", "#534a26", "#766a3e", "#908868", "#b1a781", "#cec398", "#e0d7b3", "#dcd8cb", "#e1ddd0"],
			
           
            "الأحمر البرتقالي": ["#2e1411", "#431d19", "#5e312c", "#773f39", "#96524b", "#bc7871", "#d79891", "#e6c9c6", "#e7d9d8"],
			
            "الأحمر": ["#44120d", "#661f18", "#7e2c24", "#a14138", "#bc5950", "#d26d64", "#e6837a", "#e3aba6", "#e9cac7"],
			
            "الوردي": ["#291220", "#4e293f", "#663f56", "#865873", "#af7598", "#c98eb1", "#d7a7c3", "#dfc4d4", "#ebdae4"],
			
			
			 "البنفسجي": ["#241e44", "#3a335e", "#534b7d", "#736d95", "#918bb1", "#b9b6cc", "#c6c2db", "#d8d4ec", "#e3e0f0"],
			 
			 
			 "السماوي (سيان)": ["#0e1619", "#1b2c31", "#284149", "#355761", "#45717f", "#61909f", "#77a8b7", "#99c0cc", "#c1d5db"]
			           
        }
    };

    // العناصر الرئيسية
    const mainDesignSelect = document.getElementById('main-design-select');
    const previewImage = document.getElementById('assistant-preview-image');
    const confirmBackgroundBtn = document.getElementById('confirm-background-btn');

    // المتغيرات الجديدة
    let selectedBackgroundColor = '#000000';
    let selectedPatternColor = '#000000';
    let selectedBorderColor = '#000000';

    // إنشاء لوحات الألوان الجديدة
    function createNewColorPalettes() {
        // إنشاء لوحات الألوان للخلفية
        createColorPaletteForSection('background', 'your-colors-palette', 'your-colors');
        createColorPaletteForSection('background', 'your-palette-palette', 'your-palette');
        createColorPaletteForSection('background', 'gradients-palette', 'gradients');
        
        // إنشاء لوحات الألوان للنقشة
        createColorPaletteForSection('pattern', 'pattern-your-colors-palette', 'your-colors');
        createColorPaletteForSection('pattern', 'pattern-your-palette-palette', 'your-palette');
        createColorPaletteForSection('pattern', 'pattern-gradients-palette', 'gradients');
        
        // إنشاء لوحات الألوان للحاشية
        createColorPaletteForSection('border', 'border-your-colors-palette', 'your-colors');
        createColorPaletteForSection('border', 'border-your-palette-palette', 'your-palette');
        createColorPaletteForSection('border', 'border-gradients-palette', 'gradients');
    }

    function createColorPaletteForSection(section, containerId, colorType) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container not found: ${containerId}`);
            return;
        }
        container.innerHTML = '';

        if (colorType === 'gradients') {
            // معالجة التدرجات
            for (const [gradientName, colors] of Object.entries(colorLists.gradients)) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'color-group-new';

                const groupTitle = document.createElement('h5');
                groupTitle.textContent = gradientName;
                groupDiv.appendChild(groupTitle);

                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'color-buttons-new';

                colors.forEach(color => {
                    const colorButton = document.createElement('button');
                    colorButton.className = 'color-button-new';
                    colorButton.style.backgroundColor = color;
                    colorButton.dataset.color = color;
                    colorButton.dataset.section = section;

                    colorButton.addEventListener('click', function() {
                        selectNewColor(color, section);
                    });

                    buttonsContainer.appendChild(colorButton);
                });

                groupDiv.appendChild(buttonsContainer);
                container.appendChild(groupDiv);
            }
        } else {
            // معالجة الألوان العادية
            const colors = colorLists[colorType];
            const groupDiv = document.createElement('div');
            groupDiv.className = 'color-group-new';

            const groupTitle = document.createElement('h5');
            groupTitle.textContent = colorType === 'your-colors' ? 'ألوانك' : 'لوحتك';
            groupDiv.appendChild(groupTitle);

            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'color-buttons-new';

            colors.forEach(color => {
                const colorButton = document.createElement('button');
                colorButton.className = 'color-button-new';
                colorButton.style.backgroundColor = color;
                colorButton.dataset.color = color;
                colorButton.dataset.section = section;

                colorButton.addEventListener('click', function() {
                    selectNewColor(color, section);
                });

                buttonsContainer.appendChild(colorButton);
            });

            groupDiv.appendChild(buttonsContainer);
            container.appendChild(groupDiv);
        }
    }

    // تحديد لون جديد
    function selectNewColor(color, section) {
        switch(section) {
            case 'background':
                selectedBackgroundColor = color;
                document.getElementById('background-selected-preview').style.backgroundColor = color;
                document.getElementById('final-background-color').style.backgroundColor = color;
                break;
            case 'pattern':
                selectedPatternColor = color;
                document.getElementById('pattern-selected-preview').style.backgroundColor = color;
                document.getElementById('final-pattern-color').style.backgroundColor = color;
                break;
            case 'border':
                selectedBorderColor = color;
                document.getElementById('border-selected-preview').style.backgroundColor = color;
                document.getElementById('final-border-color').style.backgroundColor = color;
                break;
        }

        // تحديث خلفية الصورة
        document.getElementById('image-display').style.backgroundColor = selectedBackgroundColor;

        // إزالة التحديد من جميع أزرار القسم
        document.querySelectorAll(`.color-button-new[data-section="${section}"]`).forEach(btn => {
            btn.classList.remove('selected');
        });

        // إضافة التحديد للزر المختار
        const selectedButton = document.querySelector(`.color-button-new[data-section="${section}"][data-color="${color}"]`);
        if (selectedButton) {
            selectedButton.classList.add('selected');
        }
    }

    // إدارة القوائم القابلة للطي
    function setupCollapsibleSections() {
        const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
        
        collapsibleHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const section = this.parentElement;
                const isActive = section.classList.contains('active');
                
                // إغلاق جميع الأقسام
                document.querySelectorAll('.color-collapsible').forEach(sec => {
                    sec.classList.remove('active');
                });
                
                // فتح القسم المطلوب إذا لم يكن نشطاً
                if (!isActive) {
                    section.classList.add('active');
                }
            });
        });
    }

    // إدارة تبويبات الألوان
    function setupColorTabs() {
        const colorTabs = document.querySelectorAll('.color-tab');
        
        colorTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabType = this.dataset.tab;
                const parentSection = this.closest('.collapsible-content');
                const parentId = parentSection.parentElement.id;
                
                // إزالة النشاط من جميع الأزرار في هذا القسم
                parentSection.querySelectorAll('.color-tab').forEach(t => {
                    t.classList.remove('active');
                });
                
                // إضافة النشاط للزر المختار
                this.classList.add('active');
                
                // إظهار اللوحة المناسبة
                parentSection.querySelectorAll('.color-palette-tab').forEach(palette => {
                    palette.classList.remove('active');
                });
                
                let paletteId = '';
                if (parentId === 'background-color-section') {
                    paletteId = `${tabType}-palette`;
                } else if (parentId === 'pattern-color-section') {
                    paletteId = `pattern-${tabType}-palette`;
                } else if (parentId === 'border-color-section') {
                    paletteId = `border-${tabType}-palette`;
                }
                
                const targetPalette = document.getElementById(paletteId);
                if (targetPalette) {
                    targetPalette.classList.add('active');
                }
            });
        });
    }

    // إعداد أزرار الألوان المخصصة
    function setupCustomColorButtons() {
        const customColorButtons = document.querySelectorAll('.custom-color-btn');
        const customColorPickers = document.querySelectorAll('.custom-color-picker');
        
        customColorButtons.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                const parentSection = this.closest('.collapsible-content');
                let sectionType = '';
                
                if (parentSection.id.includes('background')) {
                    sectionType = 'background';
                } else if (parentSection.id.includes('pattern')) {
                    sectionType = 'pattern';
                } else if (parentSection.id.includes('border')) {
                    sectionType = 'border';
                }
                
                if (customColorPickers[index]) {
                    customColorPickers[index].click();
                    customColorPickers[index].dataset.section = sectionType;
                }
            });
        });
        
        customColorPickers.forEach(picker => {
            picker.addEventListener('change', function() {
                const section = this.dataset.section;
                if (section) {
                    selectNewColor(this.value, section);
                }
            });
        });
    }

    // إرسال الرسالة عبر واتساب (محدث)
    function sendWhatsAppMessage() {
        const designNumber = mainDesignSelect.value;

        let message = `اعتمد هذا اللون [${selectedBackgroundColor}] كخلفية للنقشة رقم (${designNumber})`;

        // إضافة لون النقشة إذا لم يكن أسود
        if (selectedPatternColor !== '#000000') {
            message += `\n**لون النقشة المطلوب:** [${selectedPatternColor}]`;
        }

        // إضافة لون الحاشية إذا لم يكن أسود
        if (selectedBorderColor !== '#000000') {
            message += `\n**لون الحاشية المطلوب:** [${selectedBorderColor}]`;
        }

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/967777967272?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    }

    // تغيير الصورة بناءً على التحديد
    function changeImage() {
        const selectedValue = mainDesignSelect.value;
        previewImage.src = `backgrounds/${selectedValue}.png`;
    }

    // تهيئة جميع لوحات الألوان
    function initializeAllColorPalettes() {
        createNewColorPalettes();
    }

    // تهيئة الصفحة
    function init() {
        // إنشاء لوحات الألوان الجديدة
        initializeAllColorPalettes();
        
        // إعداد القوائم القابلة للطي
        setupCollapsibleSections();
        
        // إعداد تبويبات الألوان
        setupColorTabs();
        
        // إعداد أزرار الألوان المخصصة
        setupCustomColorButtons();

        // إضافة مستمع حدث لتغيير التصميم
        mainDesignSelect.addEventListener('change', changeImage);

        // إضافة مستمع حدث لزر التأكيد والإرسال
        confirmBackgroundBtn.addEventListener('click', sendWhatsAppMessage);

        // تحميل الصورة الأولى عند التحميل
        changeImage();
        
        // تعيين الألوان الافتراضية
        selectNewColor('#000000', 'background');
        selectNewColor('#000000', 'pattern');
        selectNewColor('#000000', 'border');
        
        // تهيئة أداة استخراج الألوان
        initializeColorPicker();
    }

    // تشغيل التهيئة عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', init);