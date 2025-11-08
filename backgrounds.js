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
    // 🌑 المجموعة الداكنة الأساسية (الأسود والكحلي العميق)
    "#0f1215", // أسود فحمي عميق جداً
    "#14191c", // رمادي فحمي عميق
    "#151a1f", // أسود مزرق داكن
    "#17223e", // أزرق بحري غامق
    "#18212a", // رمادي ليلي داكن
    "#1a1f2b", // كحلي ليلي
    "#1a2423", // أخضر غابة داكن
    "#1b1d28", // أسود بنفسجي
    "#1d1e33", // بنفسجي كحلي داكن
    "#1e2328", // رمادي فحمي متوسط
    "#202a33", // أزرق بحري بارد
    "#21252c", // رمادي صخري داكن
    "#222831", // أزرق رمادي داكن
    "#242124", // أسود ترابي
    "#2a2a28", // كاكي رمادي داكن
    "#2d353a", // رمادي فحم أزرق
    "#2f1217", // أحمر صدئ مطفأ
    // 🍂 المجموعة الترابية والبنية العميقة
    "#2e271f", // بني غامق محايد
    "#32281e", // بني شوكولاتة فاتح
    "#342e22", // بني شوكولاتة غامق
    "#35241c", // بني قهوة عميق
    "#37291d", // بني جوز عميق
    "#392a1f", // بني ترابي داكن
    "#3a2c23", // بني محروق داكن
    "#3d2e24", // بني كراميل غامق
    "#3f2d1f", // بني خشب داكن
    "#42311d", // بني غامق دافئ
    "#443625", // بني رملي داكن
    "#49382a", // بني ترابي جديد
    "#4a3a30", // بني مغبر غني
    "#4c3b2c", // بني جلد مدبوغ داكن
    "#4e3d2e", // بني قرفة مطفأ
    "#513c2a", // بني نحاسي داكن
    "#544236", // بني متوسط دافئ
    "#56412f", // بني صدئ داكن
    "#5a4534", // بني رملي داكن
    "#5c4835", // بني خشبي متوسط
    "#604e3a", // بني خشب صامت
    "#64503b", // بني جلد فاتح
    "#66543d", // بني عسلي داكن
    "#6a5640", // بني رملي دافئ
    // 💙 المجموعة الزرقاء والرمادية
    "#16242d", // أزرق بحري داكن جداً
    "#19232b", // رمادي أزرق داكن
    "#192f38", // كحلي بترولي داكن
    "#1b2a33", // أزرق بحري متوسط
    "#1e2c35", // أزرق رمادي داكن
    "#212d37", // أزرق صخري داكن
    "#23303a", // أزرق بحري فاتح قليلاً
    "#25323c", // أزرق رمادي متوسط
    "#263238", // أزرق مخضر داكن
    "#28343d", // أزرق دخاني داكن
    "#2a363f", // أزرق رمادي فاتح
    "#2d3841", // أزرق بحري هادئ
    "#303942", // أزرق رمادي صخري
    "#323d46", // أزرق رمادي متوسط
    "#35414a", // أزرق بحري ناعم
    "#374a5a", // أزرق حجري جديد
    "#38444d", // أزرق رمادي دافئ
    "#3a4750", // أزرق بحري رمادي
    "#3c4952", // أزرق رمادي فاتح
    "#3e4b54", // أزرق صخري متوسط
    "#404d56", // أزرق بحري مطفأ
    "#424345", // رمادي متوسط حيادي
    "#465767", // أزرق رمادي فاتح
    "#4a5560", // أزرق رمادي دافئ
    "#4f5a65", // أزرق دخاني متوسط
    "#525e69", // أزرق رمادي فاتح
    "#545863", // رمادي أزرق متوسط
    "#56616c", // أزرق بحري فاتح
    // 💚 المجموعة الخضراء والزيتونية
    "#1c2a21", // أخضر غابة داكن جداً
    "#1e2d23", // أخضر طحلب داكن
    "#202f25", // أخضر صنوبري داكن
    "#233126", // أخضر زيتوني داكن
    "#263428", // أخضر عشبي داكن
    "#28372a", // أخضر بندقي داكن
    "#2a392c", // أخضر طحلب متوسط
    "#2e3b2b", // أخضر طحلب غامق
    "#303e2e", // أخضر زيتوني داكن
    "#334231", // أخضر غابة متوسط
    "#344031", // أخضر بندقي عميق
    "#374533", // أخضر عشبي مطفأ
    "#3a4836", // أخضر زيتوني فاتح
    "#3d4a35", // أخضر غابة مطفأ جديد
    "#3f4d38", // أخضر طحلب فاتح
    "#434839", // أخضر زيتوني داكن بارد
    "#454c3a", // أخضر رمادي داكن
    "#484f3c", // أخضر زيتوني متوسط
    "#495546", // أخضر زيتوني عميق بارد
    "#4c5847", // أخضر حكيمي داكن
    "#4f5b48", // أخضر زيتوني فاتح
    "#525e4a", // أخضر عشبي مطفأ
    "#56614d", // أخضر رمادي فاتح
    "#576358", // أخضر حكيمي مطفأ
    "#5a6b52", // أخضر زيتوني متوسط
    "#5d6e55", // أخضر غابة فاتح
    "#607158", // أخضر زيتوني فاتح
    "#6c7f69", // زيتوني كاكي محافظ
    "#6f826b", // أخضر رمادي فاتح
    "#72856d", // أخضر عشبي مطفأ
    // ❤️ المجموعة الحمراء والأرجوانية
    "#2a151d", // عنابي داكن جداً
    "#2c1821", // عنابي داكن مطفأ
    "#2e1a23", // أحمر داكن مطفأ
    "#301c25", // بني أحمر داكن
    "#321e27", // عنابي متوسط
    "#342029", // أحمر طيني داكن
    "#36222b", // بني كرزي داكن
    "#38242d", // أحمر نبيذي داكن
    "#392a35", // أرجواني مغبر داكن
    "#3b2c3a", // بنفسجي حجري داكن
    "#3d2e3f", // بنفسجي داكن مطفأ
    "#3f3042", // أرجواني متوسط
    "#413245", // بنفسجي رمادي داكن
    "#43232c", // أحمر داكن مطفأ
    "#45232a", // عنابي مطفأ جديد
    "#47252c", // أحمر طيني متوسط
    "#49272e", // بني أحمر فاتح
    "#4a3536", // وردي مغبر داكن
    "#4c3738", // أحمر رمادي داكن
    "#4e393a", // وردي ترابي داكن
    "#50252c", // أحمر نبيذي صامت
    "#52272e", // أحمر نبيذي فاتح
    "#542930", // أحمر طوبي داكن
    "#562b32", // أحمر صدئ داكن
    "#58384a", // بنفسجي ترابي جديد
    "#5a3a4c", // أرجواني مطفأ
    "#5c3c4e", // بنفسجي متوسط
    "#5d3e40", // توتي داكن مُغبر
    "#5f4042", // وردي ترابي متوسط
    "#614244", // أحمر رمادي متوسط
    "#634446", // وردي مطفأ
    "#5f4f60", // بنفسجي دخاني متوسط
    "#615162", // بنفسجي رمادي
    "#635364", // أرجواني فاتح مطفأ
    "#6f4b4e", // أحمر قرميدي صامت
    "#714d50", // وردي ترابي فاتح
    "#734f52", // أحمر طيني فاتح
    "#7a5052", // أحمر طوبي متوسط
    "#7c5254", // أحمر رمادي فاتح
    "#7e5456", // وردي مطفأ فاتح
    // 🌟 المجموعة الفاتحة والكنارية
    "#3f382a", // خردلي داكن
    "#413a2c", // أصفر ترابي داكن
    "#433c2e", // كاكي داكن
    "#453c2a", // خردلي داكن مطفأ
    "#473e2c", // أصفر مغرة داكن
    "#49402e", // بني ذهبي داكن
    "#4b4230", // كاكي ذهبي داكن
    "#5b4c30", // أصفر مغرة داكن
    "#5d4e32", // أصفر ترابي متوسط
    "#5f5034", // كاكي متوسط
    "#615236", // ذهبي قديم داكن
    "#635438", // بني ذهبي متوسط
    "#6c593a", // ذهبي قديم صامت
    "#6e5b3c", // أصفر مغرة فاتح
    "#705d3e", // كاكي ذهبي فاتح
    "#756649", // كاكي داكن/جملي مطفأ
    "#77684b", // بني رملي فاتح
    "#796a4d", // كاكي فاتح
    "#7a6b4e", // كاكي ذهبي صامت
    "#7c6d50", // ذهبي قديم فاتح
    "#7e6f52", // أصفر ترابي فاتح
    "#8a7d5a", // كاكي مطفأ جديد
    "#8c7f5c", // بني فاتح مطفأ
    "#8e815e", // كاكي فاتح جداً
    "#908360", // أصفر رمادي فاتح
    "#9a846c", // بني فاتح ترابي
    "#9c866e", // تان فاتح
    "#9e8870", // بني جملي فاتح
    "#a08a72", // كاكي فاتح دافئ
    "#a3967a", // بيج رمادي جديد
    "#a5987c", // بيج فاتح مطفأ
    "#a79a7e", // رمادي فاتح دافئ
    "#a99c80", // بيج رمادي فاتح
    "#b59e69", // بيج ذهبي
    "#b7a06b", // ذهبي مطفأ
    "#b9a26d", // أصفر ترابي فاتح
    "#bba46f", // كاكي ذهبي فاتح
    "#c09e79", // بني جملي فاتح
    "#c2a07b", // تان فاتح دافئ
    "#c4a27d", // بني فاتح جداً
    "#c6a47f"  // بيج دافئ نهائي
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
