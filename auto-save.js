
// ==========================================================
// ** وظائف الحفظ التلقائي (Autosave) والإدارة الزمنية **
// ==========================================================

// متغير لتخزين معرّف مؤقت setInterval لتمكين إيقافه لاحقاً
let autosaveInterval = null; 

// وظيفة حفظ البيانات في Local Storage
// يجب أن تعتمد هذه الوظيفة على وجود 'currentDesignId' وأن تكون 'collectDesignData()' مُعرّفة
function saveToLocalStorage() {
    // 1. التحقق من وجود تصميم مفتوح حالياً
    if (!currentDesignId) {
        // إذا لم يكن هناك تصميم مفتوح، لا تقم بالحفظ
        return; 
    } 

    // ** ملاحظة هامة: يجب أن تكون الدالة collectDesignData() مُعرّفة في الجزء الرئيسي من script.js **
    const designData = collectDesignData(); 
    
    // 2. الحفظ باستخدام مفتاح خاص لكل تصميم
    localStorage.setItem(`design_${currentDesignId}_data`, JSON.stringify(designData));
    
    // 3. تحديث حالة التصميم (ما لم يكن "تم الإرسال" بالفعل)
    const currentStatus = localStorage.getItem(`design_${currentDesignId}_status`);
    if (currentStatus !== 'تم الإرسال') {
        const status = 'تم الاختيار';
        localStorage.setItem(`design_${currentDesignId}_status`, status);
        
        // تحديث حالة العرض في المودال إذا كان مفتوحاً
        const statusElement = document.getElementById(PREVIEW_STATUS_ID);
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = getStatusClass(status); // يجب أن تكون getStatusClass() مُعرّفة
        }
    }
    
    console.log(`Autosave: الألوان للتصميم رقم ${currentDesignId} حُفظت بنجاح.`);
}


// وظيفة بدء تشغيل الحفظ التلقائي
function startAutosave() {
    // تأكد من إيقاف أي مؤقت سابق قبل التشغيل لتجنب التكرار
    stopAutosave(); 
    
    // تشغيل الحفظ التلقائي كل 10 ثواني (10000 مللي ثانية)
    autosaveInterval = setInterval(saveToLocalStorage, 10000); 
    console.log("Autosave: تم تشغيل الحفظ التلقائي كل 10 ثوانٍ.");
}

// وظيفة إيقاف تشغيل الحفظ التلقائي
function stopAutosave() {
    if (autosaveInterval !== null) {
        clearInterval(autosaveInterval); 
        autosaveInterval = null;
        console.log("Autosave: تم إيقاف الحفظ التلقائي.");
    }
}

