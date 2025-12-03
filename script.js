document.addEventListener('DOMContentLoaded', () => {
    // ---- VARIABLES TO CONFIGURE ----
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1435871163325878413/KSm_FZhHrDf_3rJBevJ8V3Wq5aVe6L9ytQ3VZHHqmcy96EGmr7FPtSxXezySkyoQV5vE";
    const ROLE_ID = ""; // ضع هنا ID رتبة الإدارة
    const BOT_USERNAME = "PRIME CITY | نظام التقديم";
    const BOT_AVATAR = "https://cdn.discordapp.com/attachments/1389563696941891728/1412936736333369425/arOLpvZ.jpg?ex=68bac421&is=68b972a1&hm=a6c0d16ce8485ca56bc3d53b0ce6e1c68a5dda894ed6033b64ebf42f413cb216&";
    const IS_APPLICATION_OPEN = true; // غيّر هذه القيمة إلى "false" لإغلاق التقديمات

    // ---- ELEMENTS ----
    const form = document.getElementById("appForm");
    const closedMessage = document.getElementById("closedMessage");
    const submitBtn = document.querySelector(".submit-btn");
    const infoCard = document.getElementById("infoCard");
    const badge = document.querySelector('.badge');

    // ---- INITIALIZATION ----
    document.getElementById("year").textContent = new Date().getFullYear();

    // Check if applications are open
    if (!IS_APPLICATION_OPEN) {
        form.classList.add('hidden');
        closedMessage.classList.remove('hidden');
        if (badge) badge.classList.add('hidden'); // Hide badge when closed
        if (infoCard) infoCard.classList.add('hidden'); // Hide info card when closed
    } else {
        form.classList.remove('hidden');
        closedMessage.classList.add('hidden');
        if (badge) badge.classList.remove('hidden');
        if (infoCard) infoCard.classList.remove('hidden');
    }

    // ---- FORM SUBMISSION LOGIC ----
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

        // Show confirmation dialog before sending
        const result = await Swal.fire({
            icon: 'question',
            title: 'هل أنت متأكد من إرسال التقديم؟',
            html: 'برجاء التأكد من صحة جميع المعلومات المدخلة. <br> أنت تتحمل مسؤولية صحة هذه البيانات.',
            showCancelButton: true,
            confirmButtonText: 'نعم، أنا متأكد',
            cancelButtonText: 'إلغاء',
            reverseButtons: true,
            customClass: {
                container: 'swal-custom-container',
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                content: 'swal-custom-content',
                confirmButton: 'swal-custom-confirm-button',
                cancelButton: 'swal-custom-cancel-button'
            }
        });

        if (!result.isConfirmed) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الطلب';
            return; // Stop the function if user cancels
        }

        if (!WEBHOOK_URL || WEBHOOK_URL === "") {
            Swal.fire({
                icon: 'error',
                title: 'خطأ في الإعدادات',
                text: 'لم يتم ضبط رابط الويب هوك بشكل صحيح. يرجى مراجعة مسؤول الموقع.',
                confirmButtonText: 'حسناً',
                customClass: {
                    container: 'swal-custom-container',
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm-button'
                }
            });
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الطلب';
            return;
        }

        const realName = document.getElementById("realName").value.trim();
        const discordTag = document.getElementById("discordTag").value.trim();
        const discordId = document.getElementById("discordId").value.trim();
        const age = document.getElementById("age").value.trim();
        const experience = document.getElementById("experience").value.trim();
        const why = document.getElementById("why").value.trim();
        const howDidYouKnow = document.getElementById("howDidYouKnow").value.trim();
        const availability = document.getElementById("availability").value;
        const mic = document.getElementById("mic").value;
        const isCurrentAdmin = document.getElementById("isCurrentAdmin").value;

      // ---- VARIABLES TO CONFIGURE ----
const ROLE_IDS = [
    "1389554385075572836", // General
    "1389554184956936315", // Staff Manager
    "1389554112168722532"  // Assist Staff
];

// تكوين النص مع المنشنات
const mentions = `|| ${ROLE_IDS.map(id => `<@&${id}>`).join(" ")} ||`;

const payload = {
    username: BOT_USERNAME,
    avatar_url: BOT_AVATAR,
    content: `${mentions} **[تقديم إدارة جديد]** من \`${discordTag}\``,
    embeds: [{
        title: "📄 طلب إدارة جديد لـ Prime City",
        description: `**تم استلام طلب جديد من مستخدم:** \`${discordTag}\` (ID: \`${discordId}\`)`,
        color: 0xCC5500, // Deep Orange for embed border
        fields: [
            { name: "👤 الاسم الكامل", value: realName, inline: true },
            { name: "🎂 العمر", value: `${age} سنة`, inline: true },
            { name: "🏷️ اسم الديسكورد", value: discordTag, inline: true },
            { name: "🆔 معرف الديسكورد", value: discordId, inline: true },
            { name: "🎙️ جودة المايكروفون", value: mic, inline: true },
            { name: "⏱️ التفرغ الأسبوعي", value: availability, inline: true },
            { name: "📜 الخبرات السابقة", value: experience },
            { name: "🤔 لماذا أنت الأفضل؟", value: why },
            { name: "🌐 كيف علمت بنا؟", value: howDidYouKnow },
            { name: "🏢 إداري بسيرفر آخر؟", value: isCurrentAdmin, inline: true }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "Prime City | نظام التقديم الآلي", icon_url: BOT_AVATAR }
    }]
};


        try {
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "فشل إرسال البيانات إلى الديسكورد. تأكد من صحة رابط الويب هوك.");
            }

            Swal.fire({
                icon: 'success',
                title: 'تم الإرسال بنجاح',
                html: '✅ تم استلام طلبك بنجاح! <br> سيتم مراجعته والتواصل معك قريباً. <br> شكراً لاهتمامك بالانضمام إلى عائلة Prime City!',
                confirmButtonText: 'أفهم!',
                customClass: {
                    container: 'swal-custom-container',
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm-button'
                }
            });
            form.reset();
        } catch (error) {
            console.error("خطأ في الإرسال:", error);
            Swal.fire({
                icon: 'error',
                title: 'فشل الإرسال',
                html: `حدث خطأ أثناء إرسال طلبك: <br> <strong>${error.message}</strong> <br> يرجى المحاولة مرة أخرى لاحقاً أو التواصل مع الدعم الفني.`,
                confirmButtonText: 'حسناً',
                customClass: {
                    container: 'swal-custom-container',
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    content: 'swal-custom-content',
                    confirmButton: 'swal-custom-confirm-button'
                }
            });
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الطلب';
        }
    });
});
