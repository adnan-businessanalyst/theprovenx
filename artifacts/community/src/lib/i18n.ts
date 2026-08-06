import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  "en": {
    "translation": {
        "how_it_works": {
          "eyebrow": "How it works",
          "headline": "How an answer gets proven",
          "muted": "Four steps, and only the last one hands out the Proven mark.",
          "step1": {
            "title": "A question is asked",
            "copy": "Someone describes a real situation they are facing."
          },
          "step2": {
            "title": "People who lived it answer",
            "copy": "Each answer says when and where it happened."
          },
          "step3": {
            "title": "The asker picks one",
            "copy": "One answer is marked as the one that actually helped."
          },
          "step4": {
            "title": "The community votes",
            "copy": "8 confirmations from people who find this answer helpful."
          }
        },
      "nav": {
        "home": "Home",
        "tags": "Tags",
        "search": "Search",
        "contributors": "Contributors",
        "admin": "Admin",
        "ask": "Ask Question",
        "sign_in": "Sign In",
        "who_we_are": "Who We Are",
        "about": "About",
        "products": "Products",
        "blog": "Blog",
        "sign_out": "Sign Out"
      },
      "home": {
        "title": "Answers people actually lived through",
        "subtitle": "Every answer here is a first-hand account. Nothing is marked Proven until other people who did the same thing confirm it matches.",
        "topVerifiers": "Top verifiers this month",
        "newest": "Newest",
        "active": "Active",
        "votes": "Votes",
        "unanswered": "Unanswered",
        "pinned": "Pinned",
        "category_prefix": "Category: ",
        "tag_prefix": "Tag: ",
        "top_questions": "Top Questions",
        "categories": "Categories",
        "all_categories": "All categories",
        "community_pulse": "Community Pulse",
        "popular_tags": "Popular Tags",
        "view_all_tags": "View all tags →",
        "empty_state": {
          "title": "No questions found",
          "desc": "Try adjusting your filters or be the first to ask a question about this topic.",
          "clear": "Clear Filters"
        },
        "stats": {
          "questions": "Questions",
          "answers": "Answers",
          "members": "Members"
        }
      },
      "question": {
        "ask_title": "Ask a Question",
        "title_label": "Title",
        "body_label": "Details",
        "tags_label": "Tags",
        "submit": "Post Question",
        "translation_original": "Original",
        "translation_en": "English",
        "translation_ar": "العربية",
        "accept": "Accept",
        "accepted": "Accepted Answer",
        "views": "views",
        "answers": "answers",
        "vote_up": "Upvote",
        "vote_down": "Downvote",
        "related": "Related Questions",
        "answer_this": "Your Answer",
        "post_answer": "Post Answer",
        "add_comment": "Add a comment...",
        "submit_comment": "Post Comment",
        "report": "Report"
      },
      "profile": {
        "reputation": "Reputation",
        "badges": "Badges",
        "activity": "Recent Activity",
        "edit": "Edit Profile",
        "save": "Save Changes",
        "display_name": "Alias name",
        "bio": "Bio",
        "questions": "Questions",
        "answers": "Answers"
      },
      "search": {
        "placeholder": "Search questions...",
        "results": "Search Results",
        "no_results": "No questions found.",
        "filter_unanswered": "Unanswered only"
      },
      "admin": {
        "title": "Admin Overview",
        "flags": "Flagged Content",
        "users": "Users",
        "tags": "Tags",
        "transactions": "Transactions",
        "dismiss": "Dismiss",
        "remove": "Remove",
        "suspend": "Suspend",
        "restore": "Restore"
      },
      "notifications": {
        "title": "Notifications",
        "mark_all_read": "Mark all as read",
        "empty": "No new notifications"
      },
      "common": {
        "loading": "Loading...",
        "error": "An error occurred",
        "retry": "Retry",
        "save": "Save",
        "cancel": "Cancel",
        "next": "Next",
        "prev": "Previous",
        "showing": "Showing {{start}} to {{end}} of {{total}}"
      },
      "flag": {
        "title": "Report Content",
        "reason": "Reason for reporting",
        "submit": "Submit Report"
      },
      "about": {
        "title": "About The Proven X",
        "story_title": "Our Story",
        "story_body": "The Proven X was built for a simple reason: generic advice doesn't work. We want answers from people who have actually lived through the experience.",
        "promise_title": "The Proven Promise",
        "promise_body": "Nothing is marked Proven until other people who did the exact same thing confirm it matches. No theories, just verified experience.",
        "ads_title": "Proven Ads",
        "ads_body": "Reach a highly engaged, trusting audience. Our community values authenticity above all else.",
        "ads_cta": "Advertise with us",
        "sponsor_form": {
          "title": "Advertise with us",
          "subtitle": "Tell us about your company and we'll get back to you shortly.",
          "company": "Company",
          "contact_name": "Contact name",
          "email": "Email",
          "budget": "Monthly budget",
          "budget_placeholder": "Select a budget range",
          "budget_under_1k": "Under $1,000",
          "budget_1k_5k": "$1,000 – $5,000",
          "budget_5k_20k": "$5,000 – $20,000",
          "budget_over_20k": "Over $20,000",
          "budget_undecided": "Not sure yet",
          "message": "Message",
          "message_placeholder": "Tell us about your goals and audience...",
          "submit": "Send inquiry",
          "success": "Thank you! We'll be in touch soon.",
          "error": "Something went wrong. Please try again."
        },
        "sponsorship": "Sponsorship",
        "active_members": "Active Members",
        "verified_answers": "Verified Answers",
        "questions_asked": "Questions Asked",
        "trust_rate": "Trust Rate"
      },
      "products": {
        "title": "Our Products",
        "subtitle": "Websites and e-stores built to be found, understood, and acted on.",
        "web": "Website Development",
        "web_desc": "SEO-friendly informative and corporate sites that explain what you do and reach the right audience.",
        "mobile": "E-store",
        "mobile_desc": "SEO-friendly online stores designed for discovery, browsing, and checkout.",
        "view_package": "View package"
      },
      "blog": {
        "title": "Blog",
        "read_more": "Read More",
        "subtitle": "Insights, updates, and stories from the community.",
        "p1_title": "Why First-Hand Answers Beat Generic Advice",
        "p1_excerpt": "The internet is full of theories. We built this platform because we realized that the only advice worth following comes from someone who has actually been there.",
        "p2_title": "How the 'Proven' Verification System Works",
        "p2_excerpt": "A deep dive into our verification algorithm and why we don't just rely on simple upvotes to determine the best answer.",
        "p3_title": "Community Spotlight: Solving the Undocumentable",
        "p3_excerpt": "Highlighting three instances where our community solved obscure problems that had zero documentation anywhere else on the web."
      },
      "footer": {
        "terms": "Terms",
        "privacy": "Privacy",
        "help": "Help",
        "copyright": "The Proven X. Community vetted answers."
      }
    }
  },
  "ar": {
    "translation": {
        "how_it_works": {
          "eyebrow": "كيف تعمل",
          "headline": "كيف يتم إثبات الإجابة",
          "muted": "أربع خطوات، والأخيرة فقط تمنح علامة الإثبات.",
          "step1": {
            "title": "يتم طرح سؤال",
            "copy": "يصف شخص ما موقفًا حقيقيًا يواجهه."
          },
          "step2": {
            "title": "يُجيب من عاشوا التجربة",
            "copy": "توضح كل إجابة متى وأين حدث ذلك."
          },
          "step3": {
            "title": "يختار السائل إحداها",
            "copy": "يتم تمييز إجابة واحدة على أنها التي ساعدت بالفعل."
          },
          "step4": {
            "title": "يُصوت المجتمع",
            "copy": "8 تأكيدات من أشخاص وجدوا هذه الإجابة مفيدة."
          }
        },
      "nav": {
        "home": "الرئيسية",
        "tags": "الوسوم",
        "search": "بحث",
        "contributors": "المساهمون",
        "admin": "الإدارة",
        "ask": "اطرح سؤالاً",
        "sign_in": "تسجيل الدخول",
        "who_we_are": "من نحن",
        "about": "حول",
        "products": "المنتجات",
        "blog": "المدونة",
        "sign_out": "تسجيل الخروج"
      },
      "home": {
        "title": "إجابات من أشخاص عاشوا التجربة",
        "subtitle": "كل إجابة هنا هي رواية مباشرة. لا شيء يُعتبر مؤكداً حتى يؤكد أشخاص آخرون مروا بنفس التجربة تطابقه.",
        "topVerifiers": "أبرز المحققين هذا الشهر",
        "newest": "الأحدث",
        "active": "النشطة",
        "votes": "التصويتات",
        "unanswered": "بدون إجابة",
        "pinned": "مثبت",
        "category_prefix": "الفئة: ",
        "tag_prefix": "الوسم: ",
        "top_questions": "أهم الأسئلة",
        "categories": "الفئات",
        "all_categories": "كل الفئات",
        "community_pulse": "نبض المجتمع",
        "popular_tags": "الوسوم الشائعة",
        "view_all_tags": "عرض كل الوسوم ←",
        "empty_state": {
          "title": "لا توجد أسئلة",
          "desc": "حاول تعديل الفلاتر أو كن أول من يطرح سؤالاً حول هذا الموضوع.",
          "clear": "مسح الفلاتر"
        },
        "stats": {
          "questions": "أسئلة",
          "answers": "إجابات",
          "members": "أعضاء"
        }
      },
      "question": {
        "ask_title": "اطرح سؤالاً",
        "title_label": "العنوان",
        "body_label": "التفاصيل",
        "tags_label": "الوسوم",
        "submit": "نشر السؤال",
        "translation_original": "الأصلي",
        "translation_en": "English",
        "translation_ar": "العربية",
        "accept": "قبول",
        "accepted": "إجابة مقبولة",
        "views": "مشاهدات",
        "answers": "إجابات",
        "vote_up": "تصويت إيجابي",
        "vote_down": "تصويت سلبي",
        "related": "أسئلة ذات صلة",
        "answer_this": "إجابتك",
        "post_answer": "نشر الإجابة",
        "add_comment": "أضف تعليقاً...",
        "submit_comment": "نشر التعليق",
        "report": "إبلاغ"
      },
      "profile": {
        "reputation": "السمعة",
        "badges": "الأوسمة",
        "activity": "النشاط الأخير",
        "edit": "تعديل الملف",
        "save": "حفظ التغييرات",
        "display_name": "الاسم المستعار",
        "bio": "نبذة",
        "questions": "أسئلة",
        "answers": "إجابات"
      },
      "search": {
        "placeholder": "ابحث في الأسئلة...",
        "results": "نتائج البحث",
        "no_results": "لم يتم العثور على أسئلة.",
        "filter_unanswered": "بدون إجابة فقط"
      },
      "admin": {
        "title": "نظرة عامة",
        "flags": "محتوى مبلّغ عنه",
        "users": "المستخدمين",
        "tags": "الوسوم",
        "transactions": "المعاملات",
        "dismiss": "تجاهل",
        "remove": "إزالة",
        "suspend": "إيقاف",
        "restore": "استعادة"
      },
      "notifications": {
        "title": "الإشعارات",
        "mark_all_read": "تحديد الكل كمقروء",
        "empty": "لا توجد إشعارات جديدة"
      },
      "common": {
        "loading": "جاري التحميل...",
        "error": "حدث خطأ",
        "retry": "إعادة المحاولة",
        "save": "حفظ",
        "cancel": "إلغاء",
        "next": "التالي",
        "prev": "السابق",
        "showing": "عرض {{start}} إلى {{end}} من {{total}}"
      },
      "flag": {
        "title": "الإبلاغ عن محتوى",
        "reason": "سبب الإبلاغ",
        "submit": "إرسال البلاغ"
      },
      "about": {
        "title": "حول The Proven X",
        "story_title": "قصتنا",
        "story_body": "تم بناء The Proven X لسبب بسيط: النصائح العامة لا تنجح. نريد إجابات من أشخاص عاشوا التجربة بالفعل.",
        "promise_title": "الوعد المؤكد",
        "promise_body": "لا شيء يُعتبر مؤكداً حتى يؤكد أشخاص آخرون مروا بنفس التجربة تطابقه. لا نظريات، فقط تجارب موثقة.",
        "ads_title": "إعلانات مؤكدة",
        "ads_body": "الوصول إلى جمهور متفاعل وواثق. مجتمعنا يقدر الأصالة قبل كل شيء.",
        "ads_cta": "أعلن معنا",
        "sponsor_form": {
          "title": "أعلن معنا",
          "subtitle": "أخبرنا عن شركتك وسنتواصل معك قريبًا.",
          "company": "الشركة",
          "contact_name": "اسم جهة الاتصال",
          "email": "البريد الإلكتروني",
          "budget": "الميزانية الشهرية",
          "budget_placeholder": "اختر نطاق الميزانية",
          "budget_under_1k": "أقل من 1,000$",
          "budget_1k_5k": "1,000$ – 5,000$",
          "budget_5k_20k": "5,000$ – 20,000$",
          "budget_over_20k": "أكثر من 20,000$",
          "budget_undecided": "غير محدد بعد",
          "message": "الرسالة",
          "message_placeholder": "أخبرنا عن أهدافك وجمهورك...",
          "submit": "إرسال الطلب",
          "success": "شكرًا لك! سنتواصل معك قريبًا.",
          "error": "حدث خطأ ما. يرجى المحاولة مرة أخرى."
        },
        "sponsorship": "رعاية",
        "active_members": "الأعضاء النشطين",
        "verified_answers": "الإجابات المؤكدة",
        "questions_asked": "الأسئلة المطروحة",
        "trust_rate": "معدل الثقة"
      },
      "products": {
        "title": "منتجاتنا",
        "subtitle": "مواقع ومتاجر إلكترونية تُبنى لتُكتشف وتُفهم ويُتخذ عليها إجراء.",
        "web": "تطوير المواقع",
        "web_desc": "مواقع تعريفية وتجارية متوافقة مع محركات البحث تشرح عملك وتصل للجمهور المناسب.",
        "mobile": "متجر إلكتروني",
        "mobile_desc": "متاجر إلكترونية متوافقة مع محركات البحث للاكتشاف والتصفح وإتمام الشراء.",
        "view_package": "عرض الباقة"
      },
      "blog": {
        "title": "المدونة",
        "read_more": "اقرأ المزيد",
        "subtitle": "رؤى، تحديثات، وقصص من المجتمع.",
        "p1_title": "لماذا تتفوق الإجابات المباشرة على النصائح العامة",
        "p1_excerpt": "الإنترنت مليء بالنظريات. بنينا هذه المنصة لأننا أدركنا أن النصيحة الوحيدة التي تستحق الاتباع تأتي ممن خاض التجربة بالفعل.",
        "p2_title": "كيف يعمل نظام التحقق 'Proven'",
        "p2_excerpt": "نظرة عميقة على خوارزمية التحقق لدينا ولماذا لا نعتمد فقط على التصويتات البسيطة لتحديد أفضل إجابة.",
        "p3_title": "تسليط الضوء على المجتمع: حل ما لا يمكن توثيقه",
        "p3_excerpt": "إبراز ثلاث حالات قام فيها مجتمعنا بحل مشكلات غامضة لم يكن لها أي توثيق في أي مكان آخر على الويب."
      },
      "footer": {
        "terms": "الشروط",
        "privacy": "الخصوصية",
        "help": "مساعدة",
        "copyright": "The Proven X. إجابات مدققة من المجتمع."
      }
    }
  },
  "tl": {
    "translation": {
        "how_it_works": {
          "eyebrow": "Paano ito gumagana",
          "headline": "Paano napapatunayan ang isang sagot",
          "muted": "Apat na hakbang, at tanging ang huli ang nagbibigay ng markang Patunayan.",
          "step1": {
            "title": "May itatanong",
            "copy": "Inilalarawan ng isang tao ang totoong sitwasyon na kanilang hinaharap."
          },
          "step2": {
            "title": "Sasagot ang mga nakaranas nito",
            "copy": "Sinasabi ng bawat sagot kung kailan at saan ito nangyari."
          },
          "step3": {
            "title": "Pipili ang nagtanong",
            "copy": "May isang sagot na mamarkahan bilang ang nakatulong talaga."
          },
          "step4": {
            "title": "Boboto ang komunidad",
            "copy": "8 kumpirmasyon mula sa mga taong nakitang nakatulong ang sagot na ito."
          }
        },
      "nav": {
        "home": "Home",
        "tags": "Mga Tag",
        "search": "Hanapin",
        "contributors": "Mga Nag-ambag",
        "admin": "Admin",
        "ask": "Magtanong",
        "sign_in": "Mag-sign In",
        "who_we_are": "Sino Tayo",
        "about": "Tungkol",
        "products": "Mga Produkto",
        "blog": "Blog",
        "sign_out": "Mag-sign Out"
      },
      "home": {
        "title": "Mga sagot mula sa mga taong nakaranas nito",
        "subtitle": "Bawat sagot dito ay mula sa sariling karanasan. Walang markang Patunayan hanggang hindi kinukumpirma ng iba na tumutugma ito.",
        "topVerifiers": "Nangungunang mga tagasuri ngayong buwan",
        "newest": "Pinakabago",
        "active": "Aktibo",
        "votes": "Boto",
        "unanswered": "Walang sagot",
        "pinned": "Naka-pin",
        "category_prefix": "Kategorya: ",
        "tag_prefix": "Tag: ",
        "top_questions": "Nangungunang mga Tanong",
        "categories": "Mga Kategorya",
        "all_categories": "Lahat ng kategorya",
        "community_pulse": "Pulso ng Komunidad",
        "popular_tags": "Sikat na mga Tag",
        "view_all_tags": "Tingnan lahat ng tag →",
        "empty_state": {
          "title": "Walang nahanap na tanong",
          "desc": "Subukang ayusin ang iyong mga filter o maging una na magtanong tungkol sa paksang ito.",
          "clear": "I-clear ang mga Filter"
        },
        "stats": {
          "questions": "Mga Tanong",
          "answers": "Mga Sagot",
          "members": "Mga Miyembro"
        }
      },
      "question": {
        "ask_title": "Magtanong",
        "title_label": "Pamagat",
        "body_label": "Detalye",
        "tags_label": "Mga Tag",
        "submit": "I-post",
        "translation_original": "Orihinal",
        "translation_en": "Ingles",
        "translation_ar": "Arabic",
        "accept": "Tanggapin",
        "accepted": "Tinanggap",
        "views": "views",
        "answers": "sagot",
        "vote_up": "Upvote",
        "vote_down": "Downvote",
        "related": "Kaugnay",
        "answer_this": "Ang iyong sagot",
        "post_answer": "I-post ang sagot",
        "add_comment": "Magkomento...",
        "submit_comment": "I-post ang komento",
        "report": "I-report"
      },
      "profile": {
        "reputation": "Reputasyon",
        "badges": "Mga Badge",
        "activity": "Aktibidad",
        "edit": "I-edit",
        "save": "I-save",
        "display_name": "Alias name",
        "bio": "Bio",
        "questions": "Mga Tanong",
        "answers": "Mga Sagot"
      },
      "search": {
        "placeholder": "Maghanap...",
        "results": "Mga Resulta",
        "no_results": "Walang nahanap.",
        "filter_unanswered": "Walang sagot lamang"
      },
      "admin": {
        "title": "Admin",
        "flags": "Mga Nai-report",
        "users": "Mga User",
        "tags": "Mga Tag",
        "transactions": "Mga Transaksyon",
        "dismiss": "I-dismiss",
        "remove": "Alisin",
        "suspend": "I-suspend",
        "restore": "Ibalik"
      },
      "notifications": {
        "title": "Mga Notipikasyon",
        "mark_all_read": "Markahan lahat na nabasa",
        "empty": "Walang bagong notipikasyon"
      },
      "common": {
        "loading": "Naglo-load...",
        "error": "May nangyaring error",
        "retry": "Subukan muli",
        "save": "I-save",
        "cancel": "Kanselahin",
        "next": "Susunod",
        "prev": "Nakaraan",
        "showing": "Ipinapakita ang {{start}} hanggang {{end}} sa {{total}}"
      },
      "flag": {
        "title": "I-report",
        "reason": "Dahilan",
        "submit": "Isumite"
      },
      "about": {
        "title": "Tungkol sa The Proven X",
        "story_title": "Aming Kwento",
        "story_body": "Ang The Proven X ay binuo para sa isang simpleng dahilan: hindi epektibo ang pangkalahatang payo. Gusto namin ng mga sagot mula sa mga taong nakaranas na nito.",
        "promise_title": "Ang Pangako",
        "promise_body": "Walang markang Patunayan hanggang hindi kinukumpirma ng iba na tumutugma ito. Walang teorya, tanging kumpirmadong karanasan lamang.",
        "ads_title": "Mga Patalastas",
        "ads_body": "Abutin ang isang aktibo at nagtitiwalang madla. Pinahahalagahan ng aming komunidad ang pagiging tunay higit sa lahat.",
        "ads_cta": "Mag-advertise sa amin",
        "sponsor_form": {
          "title": "Mag-advertise sa amin",
          "subtitle": "Sabihin sa amin ang tungkol sa inyong kumpanya at babalikan ka namin agad.",
          "company": "Kumpanya",
          "contact_name": "Pangalan ng contact",
          "email": "Email",
          "budget": "Buwanang badyet",
          "budget_placeholder": "Pumili ng saklaw ng badyet",
          "budget_under_1k": "Mas mababa sa $1,000",
          "budget_1k_5k": "$1,000 – $5,000",
          "budget_5k_20k": "$5,000 – $20,000",
          "budget_over_20k": "Higit sa $20,000",
          "budget_undecided": "Hindi pa sigurado",
          "message": "Mensahe",
          "message_placeholder": "Ikuwento ang inyong mga layunin at audience...",
          "submit": "Ipadala ang inquiry",
          "success": "Salamat! Makikipag-ugnayan kami sa lalong madaling panahon.",
          "error": "May naganap na error. Pakisubukang muli."
        },
        "sponsorship": "Sponsorship",
        "active_members": "Mga Aktibong Miyembro",
        "verified_answers": "Mga Beripikadong Sagot",
        "questions_asked": "Mga Tanong",
        "trust_rate": "Rate ng Tiwala"
      },
      "products": {
        "title": "Aming Mga Produkto",
        "subtitle": "Websites and e-stores built to be found, understood, and acted on.",
        "web": "Website Development",
        "web_desc": "SEO-friendly informative and corporate sites that explain what you do and reach the right audience.",
        "mobile": "E-store",
        "mobile_desc": "SEO-friendly online stores designed for discovery, browsing, and checkout.",
        "view_package": "View package"
      },
      "blog": {
        "title": "Blog",
        "read_more": "Magbasa pa",
        "subtitle": "Mga insight, update, at kwento mula sa komunidad.",
        "p1_title": "Bakit Mas Mahusay ang mga Sagot sa Unang Kamay kaysa sa Pangkalahatang Payo",
        "p1_excerpt": "Ang internet ay puno ng mga teorya. Binuo namin ang platform na ito dahil natanto namin na ang tanging payo na nagkakahalagang sundin ay mula sa isang tao na nakaranas na nito.",
        "p2_title": "Paano Gumagana ang Sistema ng Pagpapatunay na 'Proven'",
        "p2_excerpt": "Isang malalim na pagtingin sa aming algorithm sa pagpapatunay at kung bakit hindi lamang kami umaasa sa mga simpleng upvote upang matukoy ang pinakamahusay na sagot.",
        "p3_title": "Spotlight ng Komunidad: Paglutas sa Hindi Dokumentado",
        "p3_excerpt": "Itinatampok ang tatlong pagkakataon kung saan nilutas ng aming komunidad ang mga malabong problema na walang dokumentasyon kahit saan man sa web."
      },
      "footer": {
        "terms": "Mga Tuntunin",
        "privacy": "Pagkapribado",
        "help": "Tulong",
        "copyright": "The Proven X. Mga sagot na sinuri ng komunidad."
      }
    }
  },
  "hi": {
    "translation": {
        "how_it_works": {
          "eyebrow": "यह कैसे काम करता है",
          "headline": "कोई उत्तर कैसे प्रमाणित होता है",
          "muted": "चार कदम, और केवल अंतिम वाला 'प्रमाणित' का चिह्न देता है।",
          "step1": {
            "title": "एक प्रश्न पूछा जाता है",
            "copy": "कोई व्यक्ति अपने सामने आने वाली एक वास्तविक स्थिति का वर्णन करता है।"
          },
          "step2": {
            "title": "जिन लोगों ने इसे जिया है, वे उत्तर देते हैं",
            "copy": "हर उत्तर यह बताता है कि यह कब और कहाँ हुआ।"
          },
          "step3": {
            "title": "पूछने वाला एक चुनता है",
            "copy": "एक उत्तर को उस रूप में चिह्नित किया जाता है जिसने वास्तव में मदद की।"
          },
          "step4": {
            "title": "समुदाय वोट करता है",
            "copy": "8 पुष्टिकरण उन लोगों से जिन्हें यह उत्तर उपयोगी लगा।"
          }
        },
      "nav": {
        "home": "मुख्य पृष्ठ",
        "tags": "टैग्स",
        "search": "खोजें",
        "contributors": "योगदानकर्ता",
        "admin": "व्यवस्थापक",
        "ask": "प्रश्न पूछें",
        "sign_in": "साइन इन",
        "who_we_are": "हम कौन हैं",
        "about": "बारे में",
        "products": "उत्पाद",
        "blog": "ब्लॉग",
        "sign_out": "साइन आउट"
      },
      "home": {
        "title": "उन लोगों के उत्तर जिन्होंने वास्तव में इसे अनुभव किया है",
        "subtitle": "यहां हर उत्तर प्रत्यक्ष अनुभव है। किसी भी चीज़ को तब तक प्रमाणित नहीं माना जाता जब तक कि उसी स्थिति से गुजरे अन्य लोग इसकी पुष्टि न करें।",
        "topVerifiers": "इस महीने के शीर्ष सत्यापनकर्ता",
        "newest": "नवीनतम",
        "active": "सक्रिय",
        "votes": "वोट",
        "unanswered": "अनुत्तरित",
        "pinned": "पिन किए गए",
        "category_prefix": "श्रेणी: ",
        "tag_prefix": "टैग: ",
        "top_questions": "शीर्ष प्रश्न",
        "categories": "श्रेणियां",
        "all_categories": "सभी श्रेणियां",
        "community_pulse": "सामुदायिक पल्स",
        "popular_tags": "लोकप्रिय टैग",
        "view_all_tags": "सभी टैग देखें →",
        "empty_state": {
          "title": "कोई प्रश्न नहीं मिला",
          "desc": "अपने फ़िल्टर समायोजित करने का प्रयास करें या इस विषय पर प्रश्न पूछने वाले पहले व्यक्ति बनें।",
          "clear": "फ़िल्टर साफ़ करें"
        },
        "stats": {
          "questions": "प्रश्न",
          "answers": "उत्तर",
          "members": "सदस्य"
        }
      },
      "question": {
        "ask_title": "प्रश्न पूछें",
        "title_label": "शीर्षक",
        "body_label": "विवरण",
        "tags_label": "टैग्स",
        "submit": "पोस्ट करें",
        "translation_original": "मूल",
        "translation_en": "English",
        "translation_ar": "العربية",
        "accept": "स्वीकार करें",
        "accepted": "स्वीकृत उत्तर",
        "views": "बार देखा गया",
        "answers": "उत्तर",
        "vote_up": "अपवोट",
        "vote_down": "डाउनवोट",
        "related": "संबंधित प्रश्न",
        "answer_this": "आपका उत्तर",
        "post_answer": "उत्तर पोस्ट करें",
        "add_comment": "टिप्पणी जोड़ें...",
        "submit_comment": "टिप्पणी पोस्ट करें",
        "report": "रिपोर्ट करें"
      },
      "profile": {
        "reputation": "प्रतिष्ठा",
        "badges": "बैज",
        "activity": "हाल की गतिविधि",
        "edit": "प्रोफ़ाइल संपादित करें",
        "save": "सहेजें",
        "display_name": "उपनाम",
        "bio": "परिचय",
        "questions": "प्रश्न",
        "answers": "उत्तर"
      },
      "search": {
        "placeholder": "प्रश्न खोजें...",
        "results": "खोज परिणाम",
        "no_results": "कोई प्रश्न नहीं मिला।",
        "filter_unanswered": "केवल अनुत्तरित"
      },
      "admin": {
        "title": "एडमिन",
        "flags": "रिपोर्ट की गई सामग्री",
        "users": "उपयोगकर्ता",
        "tags": "टैग्स",
        "transactions": "लेनदेन",
        "dismiss": "खारिज करें",
        "remove": "हटाएं",
        "suspend": "निलंबित करें",
        "restore": "पुनर्स्थापित करें"
      },
      "notifications": {
        "title": "सूचनाएं",
        "mark_all_read": "सभी को पढ़ा हुआ मानें",
        "empty": "कोई नई सूचना नहीं"
      },
      "common": {
        "loading": "लोड हो रहा है...",
        "error": "एक त्रुटि हुई",
        "retry": "पुनः प्रयास करें",
        "save": "सहेजें",
        "cancel": "रद्द करें",
        "next": "अगला",
        "prev": "पिछला",
        "showing": "{{total}} में से {{start}} से {{end}} दिखा रहा है"
      },
      "flag": {
        "title": "रिपोर्ट करें",
        "reason": "रिपोर्ट का कारण",
        "submit": "सबमिट करें"
      },
      "about": {
        "title": "The Proven X के बारे में",
        "story_title": "हमारी कहानी",
        "story_body": "The Proven X को एक साधारण कारण से बनाया गया था: सामान्य सलाह काम नहीं करती। हम उन लोगों से उत्तर चाहते हैं जिन्होंने वास्तव में अनुभव किया है।",
        "promise_title": "हमारा वादा",
        "promise_body": "किसी भी चीज़ को तब तक प्रमाणित नहीं माना जाता जब तक कि उसी स्थिति से गुजरे अन्य लोग इसकी पुष्टि न करें। कोई सिद्धांत नहीं, केवल सत्यापित अनुभव।",
        "ads_title": "विज्ञापन",
        "ads_body": "एक सक्रिय और विश्वास करने वाले दर्शकों तक पहुँचें। हमारा समुदाय सबसे ऊपर प्रामाणिकता को महत्व देता है।",
        "ads_cta": "हमारे साथ विज्ञापन करें",
        "sponsor_form": {
          "title": "हमारे साथ विज्ञापन करें",
          "subtitle": "हमें अपनी कंपनी के बारे में बताएं और हम जल्द ही आपसे संपर्क करेंगे।",
          "company": "कंपनी",
          "contact_name": "संपर्क का नाम",
          "email": "ईमेल",
          "budget": "मासिक बजट",
          "budget_placeholder": "बजट सीमा चुनें",
          "budget_under_1k": "$1,000 से कम",
          "budget_1k_5k": "$1,000 – $5,000",
          "budget_5k_20k": "$5,000 – $20,000",
          "budget_over_20k": "$20,000 से अधिक",
          "budget_undecided": "अभी तय नहीं",
          "message": "संदेश",
          "message_placeholder": "हमें अपने लक्ष्यों और दर्शकों के बारे में बताएं...",
          "submit": "अनुरोध भेजें",
          "success": "धन्यवाद! हम जल्द ही संपर्क करेंगे।",
          "error": "कुछ गलत हो गया। कृपया पुनः प्रयास करें।"
        },
        "sponsorship": "प्रायोजन",
        "active_members": "सक्रिय सदस्य",
        "verified_answers": "सत्यापित उत्तर",
        "questions_asked": "पूछे गए प्रश्न",
        "trust_rate": "विश्वास दर"
      },
      "products": {
        "title": "हमारे उत्पाद",
        "subtitle": "Websites and e-stores built to be found, understood, and acted on.",
        "web": "Website Development",
        "web_desc": "SEO-friendly informative and corporate sites that explain what you do and reach the right audience.",
        "mobile": "E-store",
        "mobile_desc": "SEO-friendly online stores designed for discovery, browsing, and checkout.",
        "view_package": "View package"
      },
      "blog": {
        "title": "ब्लॉग",
        "read_more": "और पढ़ें",
        "subtitle": "समुदाय से अंतर्दृष्टि, अपडेट और कहानियाँ।",
        "p1_title": "प्रत्यक्ष उत्तर सामान्य सलाह से बेहतर क्यों हैं",
        "p1_excerpt": "इंटरनेट सिद्धांतों से भरा है। हमने यह मंच इसलिए बनाया क्योंकि हमने महसूस किया कि पालन करने योग्य एकमात्र सलाह उस व्यक्ति से आती है जो वास्तव में वहां रहा है।",
        "p2_title": "'Proven' सत्यापन प्रणाली कैसे काम करती है",
        "p2_excerpt": "हमारे सत्यापन एल्गोरिदम में गहराई से उतरें और हम सबसे अच्छे उत्तर का निर्धारण करने के लिए केवल साधारण अपवोट पर निर्भर क्यों नहीं रहते।",
        "p3_title": "सामुदायिक स्पॉटलाइट: गैर-दस्तावेजी को हल करना",
        "p3_excerpt": "तीन ऐसे उदाहरणों को उजागर करना जहां हमारे समुदाय ने ऐसी अस्पष्ट समस्याओं को हल किया जिनका वेब पर कहीं और शून्य प्रलेखन था।"
      },
      "footer": {
        "terms": "शर्तें",
        "privacy": "गोपनीयता",
        "help": "सहायता",
        "copyright": "The Proven X. समुदाय द्वारा जाँचे गए उत्तर।"
      }
    }
  },
  "zh": {
    "translation": {
        "how_it_works": {
          "eyebrow": "运作方式",
          "headline": "一个答案是如何被验证的",
          "muted": "四个步骤，只有最后一步才会赋予“已验证”标志。",
          "step1": {
            "title": "提出问题",
            "copy": "有人描述他们正面临的真实情况。"
          },
          "step2": {
            "title": "经历过的人回答",
            "copy": "每个答案都说明发生的时间和地点。"
          },
          "step3": {
            "title": "提问者选择一个",
            "copy": "一个答案被标记为真正有帮助的答案。"
          },
          "step4": {
            "title": "社区投票",
            "copy": "8个认为此答案有帮助的人的确认。"
          }
        },
      "nav": {
        "home": "首页",
        "tags": "标签",
        "search": "搜索",
        "contributors": "贡献者",
        "admin": "管理",
        "ask": "提问",
        "sign_in": "登录",
        "who_we_are": "我们是谁",
        "about": "关于",
        "products": "产品",
        "blog": "博客",
        "sign_out": "登出"
      },
      "home": {
        "title": "来自亲历者的回答",
        "subtitle": "这里的每一个答案都是亲身经历。除非其他经历相同的人确认匹配，否则没有任何答案会被标记为已证明。",
        "topVerifiers": "本月顶级验证者",
        "newest": "最新",
        "active": "活跃",
        "votes": "投票",
        "unanswered": "未回答",
        "pinned": "置顶",
        "category_prefix": "分类：",
        "tag_prefix": "标签：",
        "top_questions": "热门问题",
        "categories": "分类",
        "all_categories": "全部分类",
        "community_pulse": "社区动态",
        "popular_tags": "热门标签",
        "view_all_tags": "查看所有标签 →",
        "empty_state": {
          "title": "未找到问题",
          "desc": "尝试调整筛选条件，或成为第一个提出该主题问题的人。",
          "clear": "清除筛选条件"
        },
        "stats": {
          "questions": "问题",
          "answers": "回答",
          "members": "成员"
        }
      },
      "question": {
        "ask_title": "提问",
        "title_label": "标题",
        "body_label": "详情",
        "tags_label": "标签",
        "submit": "发布问题",
        "translation_original": "原文",
        "translation_en": "English",
        "translation_ar": "العربية",
        "accept": "接受",
        "accepted": "已接受的答案",
        "views": "次观看",
        "answers": "个回答",
        "vote_up": "赞同",
        "vote_down": "反对",
        "related": "相关问题",
        "answer_this": "你的回答",
        "post_answer": "发布回答",
        "add_comment": "添加评论...",
        "submit_comment": "发布评论",
        "report": "举报"
      },
      "profile": {
        "reputation": "声望",
        "badges": "徽章",
        "activity": "最近活动",
        "edit": "编辑资料",
        "save": "保存",
        "display_name": "别名",
        "bio": "简介",
        "questions": "问题",
        "answers": "回答"
      },
      "search": {
        "placeholder": "搜索问题...",
        "results": "搜索结果",
        "no_results": "未找到问题",
        "filter_unanswered": "仅限未回答"
      },
      "admin": {
        "title": "管理概览",
        "flags": "被举报内容",
        "users": "用户",
        "tags": "标签",
        "transactions": "交易",
        "dismiss": "忽略",
        "remove": "移除",
        "suspend": "封禁",
        "restore": "恢复"
      },
      "notifications": {
        "title": "通知",
        "mark_all_read": "全部标为已读",
        "empty": "没有新通知"
      },
      "common": {
        "loading": "加载中...",
        "error": "发生错误",
        "retry": "重试",
        "save": "保存",
        "cancel": "取消",
        "next": "下一页",
        "prev": "上一页",
        "showing": "显示第 {{start}} 到 {{end}} 条，共 {{total}} 条"
      },
      "flag": {
        "title": "举报内容",
        "reason": "举报原因",
        "submit": "提交举报"
      },
      "about": {
        "title": "关于 The Proven X",
        "story_title": "我们的故事",
        "story_body": "创建 The Proven X 的原因很简单：泛泛的建议不起作用。我们希望得到那些亲历者的回答。",
        "promise_title": "我们的承诺",
        "promise_body": "除非其他经历相同的人确认匹配，否则没有任何答案会被标记为已证明。没有理论，只有经过验证的经验。",
        "ads_title": "广告",
        "ads_body": "接触高度参与、充满信任的受众。我们的社区最看重真实性。",
        "ads_cta": "与我们合作广告",
        "sponsor_form": {
          "title": "与我们合作广告",
          "subtitle": "告诉我们您的公司信息，我们会尽快回复您。",
          "company": "公司",
          "contact_name": "联系人姓名",
          "email": "电子邮箱",
          "budget": "每月预算",
          "budget_placeholder": "选择预算范围",
          "budget_under_1k": "低于 $1,000",
          "budget_1k_5k": "$1,000 – $5,000",
          "budget_5k_20k": "$5,000 – $20,000",
          "budget_over_20k": "超过 $20,000",
          "budget_undecided": "尚未确定",
          "message": "留言",
          "message_placeholder": "告诉我们您的目标和受众...",
          "submit": "发送咨询",
          "success": "谢谢！我们会尽快与您联系。",
          "error": "出了点问题，请重试。"
        },
        "sponsorship": "赞助",
        "active_members": "活跃成员",
        "verified_answers": "已验证回答",
        "questions_asked": "已提问数",
        "trust_rate": "信任率"
      },
      "products": {
        "title": "我们的产品",
        "subtitle": "Websites and e-stores built to be found, understood, and acted on.",
        "web": "Website Development",
        "web_desc": "SEO-friendly informative and corporate sites that explain what you do and reach the right audience.",
        "mobile": "E-store",
        "mobile_desc": "SEO-friendly online stores designed for discovery, browsing, and checkout.",
        "view_package": "View package"
      },
      "blog": {
        "title": "博客",
        "read_more": "阅读更多",
        "subtitle": "来自社区的见解、更新和故事。",
        "p1_title": "为什么亲身经历的回答胜过泛泛的建议",
        "p1_excerpt": "互联网充满了理论。我们建立这个平台是因为我们意识到，唯一值得遵循的建议来自真正亲历过的人。",
        "p2_title": "'Proven' 验证系统如何运作",
        "p2_excerpt": "深入了解我们的验证算法，以及为什么我们不仅仅依靠简单的点赞来决定最佳答案。",
        "p3_title": "社区聚焦：解决无文档记录的问题",
        "p3_excerpt": "重点介绍三个案例，我们的社区解决了在网络上其他地方没有任何文档记录的冷门问题。"
      },
      "footer": {
        "terms": "条款",
        "privacy": "隐私",
        "help": "帮助",
        "copyright": "The Proven X. 社区审核的回答。"
      }
    }
  },
  "fr": {
    "translation": {
        "how_it_works": {
          "eyebrow": "Comment ça marche",
          "headline": "Comment une réponse est prouvée",
          "muted": "Quatre étapes, et seule la dernière attribue la marque Prouvé.",
          "step1": {
            "title": "Une question est posée",
            "copy": "Quelqu'un décrit une situation réelle à laquelle il est confronté."
          },
          "step2": {
            "title": "Ceux qui l'ont vécu répondent",
            "copy": "Chaque réponse indique quand et où cela s'est produit."
          },
          "step3": {
            "title": "L'auteur choisit",
            "copy": "Une réponse est marquée comme étant celle qui a vraiment aidé."
          },
          "step4": {
            "title": "La communauté vote",
            "copy": "8 confirmations de personnes trouvant cette réponse utile."
          }
        },
      "nav": {
        "home": "Accueil",
        "tags": "Tags",
        "search": "Rechercher",
        "contributors": "Contributeurs",
        "admin": "Admin",
        "ask": "Poser une question",
        "sign_in": "Se connecter",
        "who_we_are": "Qui nous sommes",
        "about": "À propos",
        "products": "Produits",
        "blog": "Blog",
        "sign_out": "Se déconnecter"
      },
      "home": {
        "title": "Des réponses de personnes l'ayant vraiment vécu",
        "subtitle": "Chaque réponse ici est un témoignage direct. Rien n'est marqué comme Prouvé tant que d'autres personnes ayant fait la même chose ne confirment pas.",
        "topVerifiers": "Meilleurs vérificateurs ce mois-ci",
        "newest": "Plus récent",
        "active": "Actif",
        "votes": "Votes",
        "unanswered": "Sans réponse",
        "pinned": "Épinglé",
        "category_prefix": "Catégorie : ",
        "tag_prefix": "Tag : ",
        "top_questions": "Questions principales",
        "categories": "Catégories",
        "all_categories": "Toutes les catégories",
        "community_pulse": "Pouls de la communauté",
        "popular_tags": "Tags populaires",
        "view_all_tags": "Voir tous les tags →",
        "empty_state": {
          "title": "Aucune question trouvée",
          "desc": "Essayez d'ajuster vos filtres ou soyez le premier à poser une question sur ce sujet.",
          "clear": "Effacer les filtres"
        },
        "stats": {
          "questions": "Questions",
          "answers": "Réponses",
          "members": "Membres"
        }
      },
      "question": {
        "ask_title": "Poser une question",
        "title_label": "Titre",
        "body_label": "Détails",
        "tags_label": "Tags",
        "submit": "Publier",
        "translation_original": "Original",
        "translation_en": "Anglais",
        "translation_ar": "Arabe",
        "accept": "Accepter",
        "accepted": "Réponse acceptée",
        "views": "vues",
        "answers": "réponses",
        "vote_up": "Pour",
        "vote_down": "Contre",
        "related": "Questions similaires",
        "answer_this": "Votre réponse",
        "post_answer": "Publier la réponse",
        "add_comment": "Ajouter un commentaire...",
        "submit_comment": "Publier",
        "report": "Signaler"
      },
      "profile": {
        "reputation": "Réputation",
        "badges": "Badges",
        "activity": "Activité",
        "edit": "Modifier",
        "save": "Enregistrer",
        "display_name": "Nom d'alias",
        "bio": "Bio",
        "questions": "Questions",
        "answers": "Réponses"
      },
      "search": {
        "placeholder": "Rechercher...",
        "results": "Résultats",
        "no_results": "Aucun résultat.",
        "filter_unanswered": "Sans réponse"
      },
      "admin": {
        "title": "Administration",
        "flags": "Signalements",
        "users": "Utilisateurs",
        "tags": "Tags",
        "transactions": "Transactions",
        "dismiss": "Ignorer",
        "remove": "Supprimer",
        "suspend": "Suspendre",
        "restore": "Restaurer"
      },
      "notifications": {
        "title": "Notifications",
        "mark_all_read": "Tout marquer comme lu",
        "empty": "Aucune notification"
      },
      "common": {
        "loading": "Chargement...",
        "error": "Une erreur est survenue",
        "retry": "Réessayer",
        "save": "Enregistrer",
        "cancel": "Annuler",
        "next": "Suivant",
        "prev": "Précédent",
        "showing": "Affichage de {{start}} à {{end}} sur {{total}}"
      },
      "flag": {
        "title": "Signaler",
        "reason": "Raison",
        "submit": "Envoyer"
      },
      "about": {
        "title": "À propos de The Proven X",
        "story_title": "Notre histoire",
        "story_body": "The Proven X a été conçu pour une raison simple : les conseils génériques ne fonctionnent pas. Nous voulons des réponses de personnes qui ont réellement vécu l'expérience.",
        "promise_title": "Notre promesse",
        "promise_body": "Rien n'est marqué comme Prouvé tant que d'autres personnes ayant fait la même chose ne confirment pas. Pas de théories, que de l'expérience vérifiée.",
        "ads_title": "Publicités",
        "ads_body": "Atteignez un public très engagé et confiant. Notre communauté valorise l'authenticité par-dessus tout.",
        "ads_cta": "Annoncez avec nous",
        "sponsor_form": {
          "title": "Annoncez avec nous",
          "subtitle": "Parlez-nous de votre entreprise et nous vous recontacterons rapidement.",
          "company": "Entreprise",
          "contact_name": "Nom du contact",
          "email": "E-mail",
          "budget": "Budget mensuel",
          "budget_placeholder": "Sélectionnez une fourchette de budget",
          "budget_under_1k": "Moins de 1 000 $",
          "budget_1k_5k": "1 000 $ – 5 000 $",
          "budget_5k_20k": "5 000 $ – 20 000 $",
          "budget_over_20k": "Plus de 20 000 $",
          "budget_undecided": "Pas encore décidé",
          "message": "Message",
          "message_placeholder": "Parlez-nous de vos objectifs et de votre audience...",
          "submit": "Envoyer la demande",
          "success": "Merci ! Nous vous contacterons bientôt.",
          "error": "Une erreur est survenue. Veuillez réessayer."
        },
        "sponsorship": "Sponsoring",
        "active_members": "Membres actifs",
        "verified_answers": "Réponses vérifiées",
        "questions_asked": "Questions posées",
        "trust_rate": "Taux de confiance"
      },
      "products": {
        "title": "Nos produits",
        "subtitle": "Websites and e-stores built to be found, understood, and acted on.",
        "web": "Website Development",
        "web_desc": "SEO-friendly informative and corporate sites that explain what you do and reach the right audience.",
        "mobile": "E-store",
        "mobile_desc": "SEO-friendly online stores designed for discovery, browsing, and checkout.",
        "view_package": "View package"
      },
      "blog": {
        "title": "Blog",
        "read_more": "Lire la suite",
        "subtitle": "Aperçus, mises à jour et histoires de la communauté.",
        "p1_title": "Pourquoi les réponses directes valent mieux que les conseils génériques",
        "p1_excerpt": "Internet est plein de théories. Nous avons créé cette plateforme parce que nous avons réalisé que le seul conseil qui vaut la peine d'être suivi vient de quelqu'un qui a réellement vécu la situation.",
        "p2_title": "Comment fonctionne le système de vérification 'Proven'",
        "p2_excerpt": "Une plongée en profondeur dans notre algorithme de vérification et pourquoi nous ne nous fions pas simplement aux votes positifs pour déterminer la meilleure réponse.",
        "p3_title": "Pleins feux sur la communauté : Résoudre l'indocumentable",
        "p3_excerpt": "Mise en évidence de trois cas où notre communauté a résolu des problèmes obscurs qui n'avaient aucune documentation ailleurs sur le web."
      },
      "footer": {
        "terms": "Conditions",
        "privacy": "Confidentialité",
        "help": "Aide",
        "copyright": "The Proven X. Réponses validées par la communauté."
      }
    }
  },
  "es": {
    "translation": {
        "how_it_works": {
          "eyebrow": "Cómo funciona",
          "headline": "Cómo se demuestra una respuesta",
          "muted": "Cuatro pasos, y solo el último otorga la marca de Demostrado.",
          "step1": {
            "title": "Se hace una pregunta",
            "copy": "Alguien describe una situación real a la que se enfrenta."
          },
          "step2": {
            "title": "Responden quienes lo vivieron",
            "copy": "Cada respuesta dice cuándo y dónde ocurrió."
          },
          "step3": {
            "title": "El autor elige una",
            "copy": "Una respuesta se marca como la que realmente ayudó."
          },
          "step4": {
            "title": "La comunidad vota",
            "copy": "8 confirmaciones de personas a las que esta respuesta les resultó útil."
          }
        },
      "nav": {
        "home": "Inicio",
        "tags": "Etiquetas",
        "search": "Buscar",
        "contributors": "Colaboradores",
        "admin": "Admin",
        "ask": "Preguntar",
        "sign_in": "Iniciar sesión",
        "who_we_are": "Quiénes somos",
        "about": "Acerca de",
        "products": "Productos",
        "blog": "Blog",
        "sign_out": "Cerrar sesión"
      },
      "home": {
        "title": "Respuestas de personas que lo vivieron",
        "subtitle": "Cada respuesta aquí es un relato de primera mano. Nada se marca como Probado hasta que otras personas que hicieron lo mismo confirmen que coincide.",
        "topVerifiers": "Mejores verificadores de este mes",
        "newest": "Recientes",
        "active": "Activas",
        "votes": "Votos",
        "unanswered": "Sin respuesta",
        "pinned": "Fijado",
        "category_prefix": "Categoría: ",
        "tag_prefix": "Etiqueta: ",
        "top_questions": "Preguntas principales",
        "categories": "Categorías",
        "all_categories": "Todas las categorías",
        "community_pulse": "Pulso de la comunidad",
        "popular_tags": "Etiquetas populares",
        "view_all_tags": "Ver todas las etiquetas →",
        "empty_state": {
          "title": "No se encontraron preguntas",
          "desc": "Intente ajustar sus filtros o sea el primero en hacer una pregunta sobre este tema.",
          "clear": "Borrar filtros"
        },
        "stats": {
          "questions": "Preguntas",
          "answers": "Respuestas",
          "members": "Miembros"
        }
      },
      "question": {
        "ask_title": "Hacer una pregunta",
        "title_label": "Título",
        "body_label": "Detalles",
        "tags_label": "Etiquetas",
        "submit": "Publicar",
        "translation_original": "Original",
        "translation_en": "Inglés",
        "translation_ar": "Árabe",
        "accept": "Aceptar",
        "accepted": "Respuesta aceptada",
        "views": "vistas",
        "answers": "respuestas",
        "vote_up": "A favor",
        "vote_down": "En contra",
        "related": "Relacionadas",
        "answer_this": "Tu respuesta",
        "post_answer": "Publicar respuesta",
        "add_comment": "Comentar...",
        "submit_comment": "Publicar",
        "report": "Reportar"
      },
      "profile": {
        "reputation": "Reputación",
        "badges": "Insignias",
        "activity": "Actividad",
        "edit": "Editar perfil",
        "save": "Guardar",
        "display_name": "Nombre de alias",
        "bio": "Biografía",
        "questions": "Preguntas",
        "answers": "Respuestas"
      },
      "search": {
        "placeholder": "Buscar...",
        "results": "Resultados",
        "no_results": "Sin resultados.",
        "filter_unanswered": "Solo sin respuesta"
      },
      "admin": {
        "title": "Administración",
        "flags": "Reportes",
        "users": "Usuarios",
        "tags": "Etiquetas",
        "transactions": "Transacciones",
        "dismiss": "Descartar",
        "remove": "Eliminar",
        "suspend": "Suspender",
        "restore": "Restaurar"
      },
      "notifications": {
        "title": "Notificaciones",
        "mark_all_read": "Marcar leídas",
        "empty": "Sin notificaciones"
      },
      "common": {
        "loading": "Cargando...",
        "error": "Error",
        "retry": "Reintentar",
        "save": "Guardar",
        "cancel": "Cancelar",
        "next": "Siguiente",
        "prev": "Anterior",
        "showing": "Mostrando de {{start}} a {{end}} de {{total}}"
      },
      "flag": {
        "title": "Reportar",
        "reason": "Razón",
        "submit": "Enviar"
      },
      "about": {
        "title": "Acerca de The Proven X",
        "story_title": "Nuestra historia",
        "story_body": "The Proven X fue creado por una sencilla razón: los consejos genéricos no funcionan. Queremos respuestas de personas que realmente hayan vivido la experiencia.",
        "promise_title": "Nuestra promesa",
        "promise_body": "Nada se marca como Probado hasta que otras personas que hicieron lo mismo confirmen que coincide. Sin teorías, solo experiencia verificada.",
        "ads_title": "Anuncios",
        "ads_body": "Llegue a una audiencia altamente comprometida y confiada. Nuestra comunidad valora la autenticidad por encima de todo.",
        "ads_cta": "Anúnciate con nosotros",
        "sponsor_form": {
          "title": "Anúnciate con nosotros",
          "subtitle": "Cuéntanos sobre tu empresa y te responderemos pronto.",
          "company": "Empresa",
          "contact_name": "Nombre de contacto",
          "email": "Correo electrónico",
          "budget": "Presupuesto mensual",
          "budget_placeholder": "Selecciona un rango de presupuesto",
          "budget_under_1k": "Menos de $1,000",
          "budget_1k_5k": "$1,000 – $5,000",
          "budget_5k_20k": "$5,000 – $20,000",
          "budget_over_20k": "Más de $20,000",
          "budget_undecided": "Aún sin decidir",
          "message": "Mensaje",
          "message_placeholder": "Cuéntanos sobre tus objetivos y tu audiencia...",
          "submit": "Enviar consulta",
          "success": "¡Gracias! Nos pondremos en contacto pronto.",
          "error": "Algo salió mal. Inténtalo de nuevo."
        },
        "sponsorship": "Patrocinio",
        "active_members": "Miembros activos",
        "verified_answers": "Respuestas verificadas",
        "questions_asked": "Preguntas realizadas",
        "trust_rate": "Tasa de confianza"
      },
      "products": {
        "title": "Nuestros productos",
        "subtitle": "Websites and e-stores built to be found, understood, and acted on.",
        "web": "Website Development",
        "web_desc": "SEO-friendly informative and corporate sites that explain what you do and reach the right audience.",
        "mobile": "E-store",
        "mobile_desc": "SEO-friendly online stores designed for discovery, browsing, and checkout.",
        "view_package": "View package"
      },
      "blog": {
        "title": "Blog",
        "read_more": "Leer más",
        "subtitle": "Información, actualizaciones e historias de la comunidad.",
        "p1_title": "Por qué las respuestas de primera mano superan a los consejos genéricos",
        "p1_excerpt": "Internet está lleno de teorías. Construimos esta plataforma porque nos dimos cuenta de que el único consejo que vale la pena seguir proviene de alguien que realmente ha estado allí.",
        "p2_title": "Cómo funciona el sistema de verificación 'Proven'",
        "p2_excerpt": "Un análisis profundo de nuestro algoritmo de verificación y por qué no nos basamos solo en simples votos positivos para determinar la mejor respuesta.",
        "p3_title": "En el foco de la comunidad: Resolviendo lo indocumentable",
        "p3_excerpt": "Destacando tres casos en los que nuestra comunidad resolvió problemas oscuros que no tenían ninguna documentación en ningún otro lugar de la web."
      },
      "footer": {
        "terms": "Términos",
        "privacy": "Privacidad",
        "help": "Ayuda",
        "copyright": "The Proven X. Respuestas verificadas por la comunidad."
      }
    }
  },
  "ru": {
    "translation": {
        "how_it_works": {
          "eyebrow": "Как это работает",
          "headline": "Как ответ становится проверенным",
          "muted": "Четыре шага, и только последний дает знак Проверено.",
          "step1": {
            "title": "Задается вопрос",
            "copy": "Кто-то описывает реальную ситуацию, с которой столкнулся."
          },
          "step2": {
            "title": "Отвечают те, кто это пережил",
            "copy": "В каждом ответе указывается, когда и где это произошло."
          },
          "step3": {
            "title": "Автор выбирает один",
            "copy": "Один ответ отмечается как тот, который действительно помог."
          },
          "step4": {
            "title": "Голосует сообщество",
            "copy": "8 подтверждений от людей, которым этот ответ помог."
          }
        },
      "nav": {
        "home": "Главная",
        "tags": "Теги",
        "search": "Поиск",
        "contributors": "Участники",
        "admin": "Админ",
        "ask": "Задать вопрос",
        "sign_in": "Войти",
        "who_we_are": "Кто мы",
        "about": "О нас",
        "products": "Продукты",
        "blog": "Блог",
        "sign_out": "Выйти"
      },
      "home": {
        "title": "Ответы людей, которые действительно пережили это",
        "subtitle": "Каждый ответ здесь — из первых уст. Ничто не помечается как Доказанное, пока другие люди, оказавшиеся в такой же ситуации, не подтвердят это.",
        "topVerifiers": "Лучшие верификаторы в этом месяце",
        "newest": "Новые",
        "active": "Активные",
        "votes": "Голоса",
        "unanswered": "Без ответа",
        "pinned": "Закрепленные",
        "category_prefix": "Категория: ",
        "tag_prefix": "Тег: ",
        "top_questions": "Популярные вопросы",
        "categories": "Категории",
        "all_categories": "Все категории",
        "community_pulse": "Пульс сообщества",
        "popular_tags": "Популярные теги",
        "view_all_tags": "Все теги →",
        "empty_state": {
          "title": "Вопросы не найдены",
          "desc": "Попробуйте изменить фильтры или станьте первым, кто задаст вопрос на эту тему.",
          "clear": "Очистить фильтры"
        },
        "stats": {
          "questions": "Вопросы",
          "answers": "Ответы",
          "members": "Участники"
        }
      },
      "question": {
        "ask_title": "Задать вопрос",
        "title_label": "Заголовок",
        "body_label": "Детали",
        "tags_label": "Теги",
        "submit": "Опубликовать",
        "translation_original": "Оригинал",
        "translation_en": "Английский",
        "translation_ar": "Арабский",
        "accept": "Принять",
        "accepted": "Принятый ответ",
        "views": "просмотров",
        "answers": "ответов",
        "vote_up": "За",
        "vote_down": "Против",
        "related": "Связанные",
        "answer_this": "Ваш ответ",
        "post_answer": "Ответить",
        "add_comment": "Комментировать...",
        "submit_comment": "Отправить",
        "report": "Жалоба"
      },
      "profile": {
        "reputation": "Репутация",
        "badges": "Значки",
        "activity": "Активность",
        "edit": "Редактировать",
        "save": "Сохранить",
        "display_name": "Псевдоним",
        "bio": "О себе",
        "questions": "Вопросы",
        "answers": "Ответы"
      },
      "search": {
        "placeholder": "Поиск...",
        "results": "Результаты",
        "no_results": "Нет результатов.",
        "filter_unanswered": "Только без ответа"
      },
      "admin": {
        "title": "Админ-панель",
        "flags": "Жалобы",
        "users": "Пользователи",
        "tags": "Теги",
        "transactions": "Транзакции",
        "dismiss": "Отклонить",
        "remove": "Удалить",
        "suspend": "Заблокировать",
        "restore": "Восстановить"
      },
      "notifications": {
        "title": "Уведомления",
        "mark_all_read": "Прочитать все",
        "empty": "Нет новых"
      },
      "common": {
        "loading": "Загрузка...",
        "error": "Ошибка",
        "retry": "Повторить",
        "save": "Сохранить",
        "cancel": "Отмена",
        "next": "Вперед",
        "prev": "Назад",
        "showing": "Показано с {{start}} по {{end}} из {{total}}"
      },
      "flag": {
        "title": "Пожаловаться",
        "reason": "Причина",
        "submit": "Отправить"
      },
      "about": {
        "title": "О The Proven X",
        "story_title": "Наша история",
        "story_body": "The Proven X был создан по простой причине: общие советы не работают. Мы хотим получать ответы от людей, которые действительно пережили этот опыт.",
        "promise_title": "Наше обещание",
        "promise_body": "Ничто не помечается как Доказанное, пока другие люди, оказавшиеся в такой же ситуации, не подтвердят это. Никаких теорий, только проверенный опыт.",
        "ads_title": "Реклама",
        "ads_body": "Охватите вовлеченную и доверяющую аудиторию. Наше сообщество превыше всего ценит подлинность.",
        "ads_cta": "Разместить рекламу",
        "sponsor_form": {
          "title": "Разместить рекламу",
          "subtitle": "Расскажите о своей компании, и мы скоро свяжемся с вами.",
          "company": "Компания",
          "contact_name": "Контактное лицо",
          "email": "Электронная почта",
          "budget": "Месячный бюджет",
          "budget_placeholder": "Выберите диапазон бюджета",
          "budget_under_1k": "Менее $1,000",
          "budget_1k_5k": "$1,000 – $5,000",
          "budget_5k_20k": "$5,000 – $20,000",
          "budget_over_20k": "Более $20,000",
          "budget_undecided": "Ещё не определились",
          "message": "Сообщение",
          "message_placeholder": "Расскажите о ваших целях и аудитории...",
          "submit": "Отправить запрос",
          "success": "Спасибо! Мы скоро свяжемся с вами.",
          "error": "Что-то пошло не так. Попробуйте ещё раз."
        },
        "sponsorship": "Спонсорство",
        "active_members": "Активные участники",
        "verified_answers": "Проверенные ответы",
        "questions_asked": "Задано вопросов",
        "trust_rate": "Уровень доверия"
      },
      "products": {
        "title": "Наши продукты",
        "subtitle": "Websites and e-stores built to be found, understood, and acted on.",
        "web": "Website Development",
        "web_desc": "SEO-friendly informative and corporate sites that explain what you do and reach the right audience.",
        "mobile": "E-store",
        "mobile_desc": "SEO-friendly online stores designed for discovery, browsing, and checkout.",
        "view_package": "View package"
      },
      "blog": {
        "title": "Блог",
        "read_more": "Читать далее",
        "subtitle": "Инсайты, обновления и истории из сообщества.",
        "p1_title": "Почему ответы из первых уст лучше общих советов",
        "p1_excerpt": "Интернет полон теорий. Мы создали эту платформу, потому что поняли, что единственный совет, которому стоит следовать, исходит от того, кто действительно там был.",
        "p2_title": "Как работает система проверки 'Proven'",
        "p2_excerpt": "Глубокое погружение в наш алгоритм проверки и почему мы не полагаемся только на простые голоса, чтобы определить лучший ответ.",
        "p3_title": "В центре внимания сообщества: Решение недокументированного",
        "p3_excerpt": "Освещение трех случаев, когда наше сообщество решило непонятные проблемы, не имевшие никакой документации где-либо еще в сети."
      },
      "footer": {
        "terms": "Условия",
        "privacy": "Конфиденциальность",
        "help": "Помощь",
        "copyright": "The Proven X. Ответы, проверенные сообществом."
      }
    }
  },
  "uk": {
    "translation": {
        "how_it_works": {
          "eyebrow": "Як це працює",
          "headline": "Як відповідь стає перевіреною",
          "muted": "Чотири кроки, і лише останній дає знак Перевірено.",
          "step1": {
            "title": "Ставиться питання",
            "copy": "Хтось описує реальну ситуацію, з якою зіткнувся."
          },
          "step2": {
            "title": "Відповідають ті, хто це пережив",
            "copy": "У кожній відповіді вказується, коли і де це сталося."
          },
          "step3": {
            "title": "Автор обирає одну",
            "copy": "Одна відповідь позначається як та, що дійсно допомогла."
          },
          "step4": {
            "title": "Голосує спільнота",
            "copy": "8 підтверджень від людей, яким ця відповідь допомогла."
          }
        },
      "nav": {
        "home": "Головна",
        "tags": "Теги",
        "search": "Пошук",
        "contributors": "Учасники",
        "admin": "Адмін",
        "ask": "Запитати",
        "sign_in": "Увійти",
        "who_we_are": "Хто ми",
        "about": "Про нас",
        "products": "Продукти",
        "blog": "Блог",
        "sign_out": "Вийти"
      },
      "home": {
        "title": "Відповіді людей, які дійсно пережили це",
        "subtitle": "Кожна відповідь тут — з перших вуст. Ніщо не позначається як Доведене, доки інші люди, які пройшли через те саме, не підтвердять це.",
        "topVerifiers": "Найкращі верифікатори цього місяця",
        "newest": "Нові",
        "active": "Активні",
        "votes": "Голоси",
        "unanswered": "Без відповіді",
        "pinned": "Закріплені",
        "category_prefix": "Категорія: ",
        "tag_prefix": "Тег: ",
        "top_questions": "Популярні питання",
        "categories": "Категорії",
        "all_categories": "Усі категорії",
        "community_pulse": "Пульс спільноти",
        "popular_tags": "Популярні теги",
        "view_all_tags": "Всі теги →",
        "empty_state": {
          "title": "Питання не знайдені",
          "desc": "Спробуйте змінити фільтри або станьте першим, хто задасть питання на цю тему.",
          "clear": "Очистити фільтри"
        },
        "stats": {
          "questions": "Питання",
          "answers": "Відповіді",
          "members": "Учасники"
        }
      },
      "question": {
        "ask_title": "Задати питання",
        "title_label": "Заголовок",
        "body_label": "Деталі",
        "tags_label": "Теги",
        "submit": "Опублікувати",
        "translation_original": "Оригінал",
        "translation_en": "Англійська",
        "translation_ar": "Арабська",
        "accept": "Прийняти",
        "accepted": "Прийнята відповідь",
        "views": "переглядів",
        "answers": "відповідей",
        "vote_up": "За",
        "vote_down": "Проти",
        "related": "Пов'язані",
        "answer_this": "Ваша відповідь",
        "post_answer": "Відповісти",
        "add_comment": "Коментувати...",
        "submit_comment": "Надіслати",
        "report": "Скарга"
      },
      "profile": {
        "reputation": "Репутация",
        "badges": "Значки",
        "activity": "Активність",
        "edit": "Редактировать",
        "save": "Зберегти",
        "display_name": "Псевдонім",
        "bio": "Про себе",
        "questions": "Питання",
        "answers": "Відповіді"
      },
      "search": {
        "placeholder": "Пошук...",
        "results": "Результати",
        "no_results": "Немає результатів.",
        "filter_unanswered": "Тільки без відповіді"
      },
      "admin": {
        "title": "Адмін-панель",
        "flags": "Скарги",
        "users": "Користувачі",
        "tags": "Теги",
        "transactions": "Транзакції",
        "dismiss": "Відхилити",
        "remove": "Видалити",
        "suspend": "Заблокувати",
        "restore": "Відновити"
      },
      "notifications": {
        "title": "Сповіщення",
        "mark_all_read": "Прочитати всі",
        "empty": "Немає нових"
      },
      "common": {
        "loading": "Завантаження...",
        "error": "Помилка",
        "retry": "Повторити",
        "save": "Зберегти",
        "cancel": "Скасувати",
        "next": "Вперед",
        "prev": "Назад",
        "showing": "Показано з {{start}} по {{end}} з {{total}}"
      },
      "flag": {
        "title": "Поскаржитися",
        "reason": "Причина",
        "submit": "Надіслати"
      },
      "about": {
        "title": "Про The Proven X",
        "story_title": "Наша історія",
        "story_body": "The Proven X був створений з простої причини: загальні поради не працюють. Ми хочемо отримувати відповіді від людей, які дійсно пережили цей досвід.",
        "promise_title": "Наша обіцянка",
        "promise_body": "Ніщо не позначається як Доведене, доки інші люди, які пройшли через те саме, не підтвердять це. Жодних теорій, тільки перевірений досвід.",
        "ads_title": "Реклама",
        "ads_body": "Охопіть залучену та довірливу аудиторію. Наша спільнота понад усе цінує справжність.",
        "ads_cta": "Розмістити рекламу",
        "sponsor_form": {
          "title": "Розмістити рекламу",
          "subtitle": "Розкажіть про свою компанію, і ми незабаром з вами зв'яжемося.",
          "company": "Компанія",
          "contact_name": "Контактна особа",
          "email": "Електронна пошта",
          "budget": "Місячний бюджет",
          "budget_placeholder": "Виберіть діапазон бюджету",
          "budget_under_1k": "Менше $1,000",
          "budget_1k_5k": "$1,000 – $5,000",
          "budget_5k_20k": "$5,000 – $20,000",
          "budget_over_20k": "Понад $20,000",
          "budget_undecided": "Ще не визначилися",
          "message": "Повідомлення",
          "message_placeholder": "Розкажіть про ваші цілі та аудиторію...",
          "submit": "Надіслати запит",
          "success": "Дякуємо! Ми скоро зв'яжемося з вами.",
          "error": "Щось пішло не так. Спробуйте ще раз."
        },
        "sponsorship": "Спонсорство",
        "active_members": "Активні учасники",
        "verified_answers": "Перевірені відповіді",
        "questions_asked": "Задано питань",
        "trust_rate": "Рівень довіри"
      },
      "products": {
        "title": "Наші продукти",
        "subtitle": "Websites and e-stores built to be found, understood, and acted on.",
        "web": "Website Development",
        "web_desc": "SEO-friendly informative and corporate sites that explain what you do and reach the right audience.",
        "mobile": "E-store",
        "mobile_desc": "SEO-friendly online stores designed for discovery, browsing, and checkout.",
        "view_package": "View package"
      },
      "blog": {
        "title": "Блог",
        "read_more": "Читати далі",
        "subtitle": "Інсайти, оновлення та історії від спільноти.",
        "p1_title": "Чому відповіді з перших вуст кращі за загальні поради",
        "p1_excerpt": "Інтернет повний теорій. Ми створили цю платформу, тому що зрозуміли, що єдина порада, якої варто дотримуватися, виходить від того, хто дійсно там був.",
        "p2_title": "Як працює система перевірки 'Proven'",
        "p2_excerpt": "Глибоке занурення в наш алгоритм перевірки і чому ми не покладаємося лише на прості голоси, щоб визначити найкращу відповідь.",
        "p3_title": "У центрі уваги спільноти: Вирішення незадокументованого",
        "p3_excerpt": "Висвітлення трьох випадків, коли наша спільнота вирішила незрозумілі проблеми, які не мали жодної документації деінде в мережі."
      },
      "footer": {
        "terms": "Умови",
        "privacy": "Конфіденційність",
        "help": "Допомога",
        "copyright": "The Proven X. Відповіді, перевірені спільнотою."
      }
    }
  },
  "fa": {
    "translation": {
        "how_it_works": {
          "eyebrow": "نحوه کار",
          "headline": "چگونه یک پاسخ اثبات می‌شود",
          "muted": "چهار مرحله، و فقط مرحله آخر نشان اثبات‌شده را می‌دهد.",
          "step1": {
            "title": "یک سوال پرسیده می‌شود",
            "copy": "شخصی یک موقعیت واقعی را که با آن روبرو شده توصیف می‌کند."
          },
          "step2": {
            "title": "افرادی که آن را تجربه کرده‌اند پاسخ می‌دهند",
            "copy": "هر پاسخ می‌گوید چه زمانی و کجا اتفاق افتاده است."
          },
          "step3": {
            "title": "پرسشگر یکی را انتخاب می‌کند",
            "copy": "یک پاسخ به عنوان پاسخی که واقعاً کمک کرده علامت‌گذاری می‌شود."
          },
          "step4": {
            "title": "جامعه رأی می‌دهد",
            "copy": "۸ تایید از افرادی که این پاسخ را مفید یافته‌اند."
          }
        },
      "nav": {
        "home": "خانه",
        "tags": "برچسب‌ها",
        "search": "جستجو",
        "contributors": "مشارکت‌کنندگان",
        "admin": "مدیریت",
        "ask": "پرسیدن سوال",
        "sign_in": "ورود",
        "who_we_are": "ما کیستیم",
        "about": "درباره ما",
        "products": "محصولات",
        "blog": "وبلاگ",
        "sign_out": "خروج"
      },
      "home": {
        "title": "پاسخ از افرادی که واقعاً آن را تجربه کرده‌اند",
        "subtitle": "هر پاسخ در اینجا یک روایت دست اول است. هیچ چیز تایید شده علامت‌گذاری نمی‌شود تا زمانی که دیگرانی که همان کار را انجام داده‌اند آن را تایید کنند.",
        "topVerifiers": "برترین تاییدکنندگان این ماه",
        "newest": "جدیدترین",
        "active": "فعال",
        "votes": "آرا",
        "unanswered": "بدون پاسخ",
        "pinned": "سنجاق شده",
        "category_prefix": "دسته‌بندی: ",
        "tag_prefix": "برچسب: ",
        "top_questions": "سوالات برتر",
        "categories": "دسته‌بندی‌ها",
        "all_categories": "همه دسته‌بندی‌ها",
        "community_pulse": "نبض جامعه",
        "popular_tags": "برچسب‌های محبوب",
        "view_all_tags": "مشاهده همه برچسب‌ها ←",
        "empty_state": {
          "title": "سوالی یافت نشد",
          "desc": "فیلترهای خود را تغییر دهید یا اولین نفری باشید که در این مورد سوال می‌پرسید.",
          "clear": "پاک کردن فیلترها"
        },
        "stats": {
          "questions": "سوالات",
          "answers": "پاسخ‌ها",
          "members": "اعضا"
        }
      },
      "question": {
        "ask_title": "پرسیدن سوال",
        "title_label": "عنوان",
        "body_label": "جزئیات",
        "tags_label": "برچسب‌ها",
        "submit": "ارسال",
        "translation_original": "اصلی",
        "translation_en": "انگلیسی",
        "translation_ar": "عربی",
        "accept": "پذیرش",
        "accepted": "پاسخ پذیرفته شده",
        "views": "بازدید",
        "answers": "پاسخ",
        "vote_up": "موافق",
        "vote_down": "مخالف",
        "related": "مرتبط",
        "answer_this": "پاسخ شما",
        "post_answer": "ارسال پاسخ",
        "add_comment": "ثبت نظر...",
        "submit_comment": "ارسال",
        "report": "گزارش"
      },
      "profile": {
        "reputation": "اعتبار",
        "badges": "نشان‌ها",
        "activity": "فعالیت‌ها",
        "edit": "ویرایش",
        "save": "ذخیره",
        "display_name": "نام مستعار",
        "bio": "درباره من",
        "questions": "سوالات",
        "answers": "پاسخ‌ها"
      },
      "search": {
        "placeholder": "جستجو...",
        "results": "نتایج",
        "no_results": "موردی یافت نشد.",
        "filter_unanswered": "فقط بدون پاسخ"
      },
      "admin": {
        "title": "مدیریت",
        "flags": "گزارش‌ها",
        "users": "کاربران",
        "tags": "برچسب‌ها",
        "transactions": "تراکنش‌ها",
        "dismiss": "رد",
        "remove": "حذف",
        "suspend": "تعلیق",
        "restore": "بازیابی"
      },
      "notifications": {
        "title": "اعلان‌ها",
        "mark_all_read": "خواندن همه",
        "empty": "بدون اعلان جدید"
      },
      "common": {
        "loading": "در حال بارگذاری...",
        "error": "خطا رخ داد",
        "retry": "تلاش مجدد",
        "save": "ذخیره",
        "cancel": "لغو",
        "next": "بعدی",
        "prev": "قبلی",
        "showing": "نمایش {{start}} تا {{end}} از {{total}}"
      },
      "flag": {
        "title": "گزارش تخلف",
        "reason": "دلیل",
        "submit": "ارسال"
      },
      "about": {
        "title": "درباره The Proven X",
        "story_title": "داستان ما",
        "story_body": "The Proven X به یک دلیل ساده ساخته شد: توصیه‌های عمومی کارساز نیستند. ما پاسخ‌هایی از افرادی می‌خواهیم که واقعاً آن را تجربه کرده‌اند.",
        "promise_title": "تعهد ما",
        "promise_body": "هیچ چیز تایید شده علامت‌گذاری نمی‌شود تا زمانی که دیگرانی که همان کار را انجام داده‌اند آن را تایید کنند. بدون نظریه، فقط تجربه تایید شده.",
        "ads_title": "تبلیغات",
        "ads_body": "به مخاطبانی متعهد و معتمد دسترسی پیدا کنید. جامعه ما اصالت را بیش از هر چیز ارزش می‌نهد.",
        "ads_cta": "با ما تبلیغ کنید",
        "sponsor_form": {
          "title": "با ما تبلیغ کنید",
          "subtitle": "درباره شرکت خود به ما بگویید و ما به‌زودی با شما تماس می‌گیریم.",
          "company": "شرکت",
          "contact_name": "نام تماس",
          "email": "ایمیل",
          "budget": "بودجه ماهانه",
          "budget_placeholder": "محدوده بودجه را انتخاب کنید",
          "budget_under_1k": "کمتر از ۱٬۰۰۰ دلار",
          "budget_1k_5k": "۱٬۰۰۰ – ۵٬۰۰۰ دلار",
          "budget_5k_20k": "۵٬۰۰۰ – ۲۰٬۰۰۰ دلار",
          "budget_over_20k": "بیش از ۲۰٬۰۰۰ دلار",
          "budget_undecided": "هنوز مشخص نیست",
          "message": "پیام",
          "message_placeholder": "درباره اهداف و مخاطبان خود به ما بگویید...",
          "submit": "ارسال درخواست",
          "success": "متشکریم! به‌زودی با شما تماس می‌گیریم.",
          "error": "مشکلی پیش آمد. لطفاً دوباره امتحان کنید."
        },
        "sponsorship": "حمایت مالی",
        "active_members": "اعضای فعال",
        "verified_answers": "پاسخ‌های تایید شده",
        "questions_asked": "سوالات پرسیده شده",
        "trust_rate": "نرخ اعتماد"
      },
      "products": {
        "title": "محصولات ما",
        "subtitle": "Websites and e-stores built to be found, understood, and acted on.",
        "web": "Website Development",
        "web_desc": "SEO-friendly informative and corporate sites that explain what you do and reach the right audience.",
        "mobile": "E-store",
        "mobile_desc": "SEO-friendly online stores designed for discovery, browsing, and checkout.",
        "view_package": "View package"
      },
      "blog": {
        "title": "وبلاگ",
        "read_more": "بیشتر بخوانید",
        "subtitle": "بینش‌ها، به‌روزرسانی‌ها و داستان‌هایی از جامعه.",
        "p1_title": "چرا پاسخ‌های مستقیم بهتر از توصیه‌های عمومی هستند",
        "p1_excerpt": "اینترنت پر از نظریه است. ما این پلتفرم را ساختیم زیرا متوجه شدیم که تنها توصیه‌ای که ارزش پیروی دارد از طرف کسی است که واقعاً آن را تجربه کرده است.",
        "p2_title": "سیستم تایید 'Proven' چگونه کار می‌کند",
        "p2_excerpt": "نگاهی عمیق به الگوریتم تایید ما و اینکه چرا برای تعیین بهترین پاسخ فقط به رای‌های مثبت ساده متکی نیستیم.",
        "p3_title": "تمرکز بر جامعه: حل مشکلات بدون مستندات",
        "p3_excerpt": "برجسته کردن سه مورد که در آن جامعه ما مشکلات مبهمی را حل کرد که هیچ مستنداتی در هیچ جای وب نداشتند."
      },
      "footer": {
        "terms": "شرایط",
        "privacy": "حریم خصوصی",
        "help": "راهنما",
        "copyright": "The Proven X. پاسخ‌های تایید شده جامعه."
      }
    }
  },
  "ur": {
    "translation": {
        "how_it_works": {
          "eyebrow": "یہ کیسے کام کرتا ہے",
          "headline": "جواب کیسے ثابت ہوتا ہے",
          "muted": "چار مراحل، اور صرف آخری مرحلہ ثابت شدہ کا نشان دیتا ہے۔",
          "step1": {
            "title": "ایک سوال پوچھا جاتا ہے",
            "copy": "کوئی شخص ایسی حقیقی صورتحال بیان کرتا ہے جس کا وہ سامنا کر رہا ہے۔"
          },
          "step2": {
            "title": "جنہوں نے اسے جیا وہ جواب دیتے ہیں",
            "copy": "ہر جواب بتاتا ہے کہ یہ کب اور کہاں ہوا۔"
          },
          "step3": {
            "title": "پوچھنے والا ایک چنتا ہے",
            "copy": "ایک جواب کو اس کے طور پر نشان زد کیا جاتا ہے جس نے واقعی مدد کی۔"
          },
          "step4": {
            "title": "کمیونٹی ووٹ دیتی ہے",
            "copy": "8 تصدیقات ان لوگوں کی طرف سے جنہیں یہ جواب مفید لگا۔"
          }
        },
      "nav": {
        "home": "ہوم",
        "tags": "ٹیگز",
        "search": "تلاش",
        "contributors": "معاونین",
        "admin": "ایڈمن",
        "ask": "سوال پوچھیں",
        "sign_in": "سائن ان",
        "who_we_are": "ہم کون ہیں",
        "about": "ہمارے بارے میں",
        "products": "مصنوعات",
        "blog": "بلاگ",
        "sign_out": "سائن آؤٹ"
      },
      "home": {
        "title": "ان لوگوں کے جوابات جنہوں نے واقعی اس کا تجربہ کیا",
        "subtitle": "یہاں ہر جواب ایک براہ راست تجربہ ہے۔ کوئی بھی چیز اس وقت تک ثابت شدہ قرار نہیں دی جاتی جب تک کہ دوسرے لوگ جنہوں نے وہی کیا ہے اس کی تصدیق نہ کریں۔",
        "topVerifiers": "اس مہینے کے ٹاپ تصدیق کنندگان",
        "newest": "تازہ ترین",
        "active": "فعال",
        "votes": "ووٹ",
        "unanswered": "بغیر جواب",
        "pinned": "پن کردہ",
        "category_prefix": "زمرہ: ",
        "tag_prefix": "ٹیگ: ",
        "top_questions": "اہم سوالات",
        "categories": "زمرے",
        "all_categories": "تمام زمرے",
        "community_pulse": "کمیونٹی کی دھڑکن",
        "popular_tags": "مقبول ٹیگز",
        "view_all_tags": "تمام ٹیگز دیکھیں ←",
        "empty_state": {
          "title": "کوئی سوال نہیں ملا",
          "desc": "اپنے فلٹرز کو تبدیل کرنے کی کوشش کریں یا اس موضوع پر سوال پوچھنے والے پہلے شخص بنیں۔",
          "clear": "فلٹرز صاف کریں"
        },
        "stats": {
          "questions": "سوالات",
          "answers": "جوابات",
          "members": "ارکان"
        }
      },
      "question": {
        "ask_title": "سوال پوچھیں",
        "title_label": "عنوان",
        "body_label": "تفصیلات",
        "tags_label": "ٹیگز",
        "submit": "شائع کریں",
        "translation_original": "اصل",
        "translation_en": "انگریزی",
        "translation_ar": "عربی",
        "accept": "قبول کریں",
        "accepted": "منظور شدہ جواب",
        "views": "مناظر",
        "answers": "جوابات",
        "vote_up": "اپ ووٹ",
        "vote_down": "ڈاؤن ووٹ",
        "related": "متعلقہ",
        "answer_this": "آپ کا جواب",
        "post_answer": "جواب شائع کریں",
        "add_comment": "تبصرہ کریں...",
        "submit_comment": "شائع کریں",
        "report": "رپورٹ"
      },
      "profile": {
        "reputation": "ساکھ",
        "badges": "بیج",
        "activity": "سرگرمی",
        "edit": "ترمیم",
        "save": "محفوظ کریں",
        "display_name": "نام مستعار",
        "bio": "تعارف",
        "questions": "سوالات",
        "answers": "جوابات"
      },
      "search": {
        "placeholder": "تلاش کریں...",
        "results": "نتائج",
        "no_results": "کوئی نتیجہ نہیں",
        "filter_unanswered": "صرف بغیر جواب"
      },
      "admin": {
        "title": "ایڈمن",
        "flags": "رپورٹس",
        "users": "صارفین",
        "tags": "ٹیگز",
        "transactions": "لین دین",
        "dismiss": "مسترد",
        "remove": "حذف کریں",
        "suspend": "معطل کریں",
        "restore": "بحال کریں"
      },
      "notifications": {
        "title": "اطلاعات",
        "mark_all_read": "سب پڑھ لیں",
        "empty": "کوئی نئی اطلاع نہیں"
      },
      "common": {
        "loading": "لوڈ ہو رہا ہے...",
        "error": "غلطی",
        "retry": "دوبارہ کوشش کریں",
        "save": "محفوظ کریں",
        "cancel": "منسوخ",
        "next": "اگلا",
        "prev": "پچھلا",
        "showing": "{{total}} میں سے {{start}} سے {{end}} دکھا رہا ہے"
      },
      "flag": {
        "title": "رپورٹ کریں",
        "reason": "وجہ",
        "submit": "جمع کریں"
      },
      "about": {
        "title": "The Proven X کے بارے میں",
        "story_title": "ہماری کہانی",
        "story_body": "The Proven X کو ایک سادہ سی وجہ سے بنایا گیا تھا: عام مشورے کام نہیں کرتے۔ ہم ان لوگوں سے جوابات چاہتے ہیں جنہوں نے واقعی اس کا تجربہ کیا ہے۔",
        "promise_title": "ہمارا وعدہ",
        "promise_body": "کوئی بھی چیز اس وقت تک ثابت شدہ قرار نہیں دی جاتی جب تک کہ دوسرے لوگ جنہوں نے وہی کیا ہے اس کی تصدیق نہ کریں۔ کوئی نظریہ نہیں، صرف تصدیق شدہ تجربہ۔",
        "ads_title": "اشتہارات",
        "ads_body": "ایک متحرک اور پر اعتماد سامعین تک پہنچیں۔ ہماری کمیونٹی سب سے بڑھ کر اصلیت کی قدر کرتی ہے۔",
        "ads_cta": "ہمارے ساتھ اشتہار دیں",
        "sponsor_form": {
          "title": "ہمارے ساتھ اشتہار دیں",
          "subtitle": "ہمیں اپنی کمپنی کے بارے میں بتائیں اور ہم جلد آپ سے رابطہ کریں گے۔",
          "company": "کمپنی",
          "contact_name": "رابطہ کا نام",
          "email": "ای میل",
          "budget": "ماہانہ بجٹ",
          "budget_placeholder": "بجٹ کی حد منتخب کریں",
          "budget_under_1k": "$1,000 سے کم",
          "budget_1k_5k": "$1,000 – $5,000",
          "budget_5k_20k": "$5,000 – $20,000",
          "budget_over_20k": "$20,000 سے زیادہ",
          "budget_undecided": "ابھی طے نہیں",
          "message": "پیغام",
          "message_placeholder": "ہمیں اپنے اہداف اور سامعین کے بارے میں بتائیں...",
          "submit": "درخواست بھیجیں",
          "success": "شکریہ! ہم جلد رابطہ کریں گے۔",
          "error": "کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔"
        },
        "sponsorship": "اسپانسرشپ",
        "active_members": "فعال ممبران",
        "verified_answers": "تصدیق شدہ جوابات",
        "questions_asked": "پوچھے گئے سوالات",
        "trust_rate": "اعتماد کی شرح"
      },
      "products": {
        "title": "ہماری مصنوعات",
        "subtitle": "Websites and e-stores built to be found, understood, and acted on.",
        "web": "Website Development",
        "web_desc": "SEO-friendly informative and corporate sites that explain what you do and reach the right audience.",
        "mobile": "E-store",
        "mobile_desc": "SEO-friendly online stores designed for discovery, browsing, and checkout.",
        "view_package": "View package"
      },
      "blog": {
        "title": "بلاگ",
        "read_more": "مزید پڑھیں",
        "subtitle": "کمیونٹی کی بصیرتیں، اپ ڈیٹس، اور کہانیاں۔",
        "p1_title": "براہ راست جوابات عام مشورے سے بہتر کیوں ہیں",
        "p1_excerpt": "انٹرنیٹ نظریات سے بھرا پڑا ہے۔ ہم نے یہ پلیٹ فارم اس لیے بنایا کیونکہ ہمیں احساس ہوا کہ عمل کرنے کے لائق واحد مشورہ اس شخص سے آتا ہے جس نے واقعی اس کا تجربہ کیا ہو۔",
        "p2_title": "'Proven' تصدیق کا نظام کیسے کام کرتا ہے",
        "p2_excerpt": "ہمارے تصدیق کے الگورتھم کا گہرا جائزہ اور یہ کہ ہم بہترین جواب کا تعین کرنے کے لیے صرف سادہ اپ ووٹ پر انحصار کیوں نہیں کرتے۔",
        "p3_title": "کمیونٹی کی جھلک: غیر دستاویزی مسائل کو حل کرنا",
        "p3_excerpt": "تین ایسی مثالوں کو اجاگر کرنا جہاں ہماری کمیونٹی نے ایسے مبہم مسائل کو حل کیا جن کی ویب پر کہیں اور کوئی دستاویزات نہیں تھیں۔"
      },
      "footer": {
        "terms": "شرائط",
        "privacy": "رازداری",
        "help": "مدد",
        "copyright": "The Proven X. کمیونٹی کے تصدیق شدہ جوابات۔"
      }
    }
  },
  "bn": {
    "translation": {
        "how_it_works": {
          "eyebrow": "এটি কীভাবে কাজ করে",
          "headline": "একটি উত্তর কীভাবে প্রমাণিত হয়",
          "muted": "চারটি ধাপ, এবং শুধুমাত্র শেষটি 'প্রমাণিত' চিহ্ন প্রদান করে।",
          "step1": {
            "title": "একটি প্রশ্ন জিজ্ঞাসা করা হয়",
            "copy": "কেউ তাদের সম্মুখীন হওয়া একটি বাস্তব পরিস্থিতি বর্ণনা করে।"
          },
          "step2": {
            "title": "যারা এর মধ্য দিয়ে গেছে তারা উত্তর দেয়",
            "copy": "প্রতিটি উত্তরে বলা হয় কখন এবং কোথায় এটি ঘটেছিল।"
          },
          "step3": {
            "title": "জিজ্ঞাসাকারী একটি বেছে নেয়",
            "copy": "একটি উত্তরকে এমনভাবে চিহ্নিত করা হয় যা সত্যিই সাহায্য করেছে।"
          },
          "step4": {
            "title": "সম্প্রদায় ভোট দেয়",
            "copy": "৮ জনের নিশ্চিতকরণ যারা এই উত্তরটি সহায়ক বলে মনে করেন।"
          }
        },
      "nav": {
        "home": "হোম",
        "tags": "ট্যাগ",
        "search": "অনুসন্ধান",
        "contributors": "অবদানকারী",
        "admin": "অ্যাডমিন",
        "ask": "প্রশ্ন করুন",
        "sign_in": "সাইন ইন",
        "who_we_are": "আমরা কারা",
        "about": "সম্পর্কে",
        "products": "পণ্য",
        "blog": "ব্লগ",
        "sign_out": "সাইন আউট"
      },
      "home": {
        "title": "যাঁরা সত্যিই অভিজ্ঞতা অর্জন করেছেন তাঁদের উত্তর",
        "subtitle": "এখানকার প্রতিটি উত্তর প্রথম হাতের অভিজ্ঞতা। অন্যান্য মানুষ যারা একই কাজ করেছে তারা এটি নিশ্চিত না করা পর্যন্ত কোন কিছু প্রমাণিত হিসেবে চিহ্নিত করা হয় অচ।",
        "topVerifiers": "এই মাসে শীর্ষ যাচাইকারী",
        "newest": "নতুন",
        "active": "সক্রিয়",
        "votes": "ভোট",
        "unanswered": "উত্তরহীন",
        "pinned": "পিন করা",
        "category_prefix": "বিভাগ: ",
        "tag_prefix": "ট্যাগ: ",
        "top_questions": "শীর্ষ প্রশ্ন",
        "categories": "বিভাগ",
        "all_categories": "সব বিভাগ",
        "community_pulse": "কমিউনিটি পালস",
        "popular_tags": "জনপ্রিয় ট্যাগ",
        "view_all_tags": "সব ট্যাগ দেখুন →",
        "empty_state": {
          "title": "কোন প্রশ্ন পাওয়া যায়নি",
          "desc": "আপনার ফিল্টারগুলি সামঞ্জস্য করার চেষ্টা করুন বা এই বিষয়ে প্রশ্ন জিজ্ঞাসা করার প্রথম ব্যক্তি হন।",
          "clear": "ফিল্টার সাফ করুন"
        },
        "stats": {
          "questions": "প্রশ্ন",
          "answers": "উত্তর",
          "members": "সদস্য"
        }
      },
      "question": {
        "ask_title": "প্রশ্ন করুন",
        "title_label": "শিরোনাম",
        "body_label": "বিস্তারিত",
        "tags_label": "ট্যাগ",
        "submit": "পোস্ট করুন",
        "translation_original": "আসল",
        "translation_en": "ইংরেজি",
        "translation_ar": "আরবি",
        "accept": "গ্রহণ করুন",
        "accepted": "গৃহীত উত্তর",
        "views": "ভিউ",
        "answers": "উত্তর",
        "vote_up": "আপভোট",
        "vote_down": "ডাউনভোট",
        "related": "সম্পর্কিত",
        "answer_this": "আপনার উত্তর",
        "post_answer": "উত্তর পোস্ট করুন",
        "add_comment": "মন্তব্য যোগ করুন...",
        "submit_comment": "পোস্ট করুন",
        "report": "রিপোর্ট"
      },
      "profile": {
        "reputation": "সুনাম",
        "badges": "ব্যাজ",
        "activity": "কার্যকলাপ",
        "edit": "সম্পাদনা",
        "save": "সংরক্ষণ",
        "display_name": "উপনাম",
        "bio": "বায়ো",
        "questions": "প্রশ্ন",
        "answers": "উত্তর"
      },
      "search": {
        "placeholder": "অনুসন্ধান...",
        "results": "ফলাফল",
        "no_results": "কিছু পাওয়া যায়নি",
        "filter_unanswered": "শুধুমাত্র উত্তরহীন"
      },
      "admin": {
        "title": "অ্যাডমিন",
        "flags": "রিপোর্ট",
        "users": "ব্যবহারকারী",
        "tags": "ট্যাগ",
        "transactions": "লেনদেন",
        "dismiss": "বাতিল",
        "remove": "মুছুন",
        "suspend": "সাসপেন্ড",
        "restore": "পুনরুদ্ধার"
      },
      "notifications": {
        "title": "বিজ্ঞপ্তি",
        "mark_all_read": "সব পড়া হিসেবে চিহ্নিত করুন",
        "empty": "কোন নতুন বিজ্ঞপ্তি নেই"
      },
      "common": {
        "loading": "লোড হচ্ছে...",
        "error": "ত্রুটি",
        "retry": "পুনরায় চেষ্টা করুন",
        "save": "সংরক্ষণ",
        "cancel": "বাতিল",
        "next": "পরবর্তী",
        "prev": "পূর্ববর্তী",
        "showing": "{{total}} এর মধ্যে {{start}} থেকে {{end}} দেখানো হচ্ছে"
      },
      "flag": {
        "title": "রিপোর্ট করুন",
        "reason": "কারণ",
        "submit": "জমা দিন"
      },
      "about": {
        "title": "The Proven X সম্পর্কে",
        "story_title": "আমাদের গল্প",
        "story_body": "The Proven X একটি সাধারণ কারণে তৈরি করা হয়েছিল: সাধারণ পরামর্শ কাজ করে কাশী। আমরা এমন লোকদের কাছ থেকে উত্তর চাই যারা সত্যিই অভিজ্ঞতা অর্জন করেছেন।",
        "promise_title": "আমাদের প্রতিশ্রুতি",
        "promise_body": "অন্যান্য মানুষ যারা একই কাজ করেছে তারা এটি নিশ্চিত না করা পর্যন্ত কোন কিছু প্রমাণিত হিসেবে চিহ্নিত করা হয় না। কোন তত্ত্ব নয়, শুধু যাচাইকৃত অভিজ্ঞতা।",
        "ads_title": "বিজ্ঞাপন",
        "ads_body": "একটি অত্যন্ত জড়িত, বিশ্বস্ত শ্রোতাদের কাছে পৌঁছান। আমাদের সম্প্রদায় সব কিছুর উপরে সত্যতাকে মূল্য দেয়।",
        "ads_cta": "আমাদের সাথে বিজ্ঞাপন দিন",
        "sponsor_form": {
          "title": "আমাদের সাথে বিজ্ঞাপন দিন",
          "subtitle": "আপনার কোম্পানি সম্পর্কে আমাদের জানান, আমরা শীঘ্রই যোগাযোগ করব।",
          "company": "কোম্পানি",
          "contact_name": "যোগাযোগের নাম",
          "email": "ইমেইল",
          "budget": "মাসিক বাজেট",
          "budget_placeholder": "বাজেটের পরিসর নির্বাচন করুন",
          "budget_under_1k": "$1,000-এর কম",
          "budget_1k_5k": "$1,000 – $5,000",
          "budget_5k_20k": "$5,000 – $20,000",
          "budget_over_20k": "$20,000-এর বেশি",
          "budget_undecided": "এখনও নিশ্চিত নই",
          "message": "বার্তা",
          "message_placeholder": "আপনার লক্ষ্য ও দর্শক সম্পর্কে আমাদের বলুন...",
          "submit": "অনুরোধ পাঠান",
          "success": "ধন্যবাদ! আমরা শীঘ্রই যোগাযোগ করব।",
          "error": "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।"
        },
        "sponsorship": "স্পন্সরশিপ",
        "active_members": "সক্রিয় সদস্য",
        "verified_answers": "যাচাইকৃত উত্তর",
        "questions_asked": "জিজ্ঞাসিত প্রশ্ন",
        "trust_rate": "বিশ্বাসের হার"
      },
      "products": {
        "title": "আমাদের পণ্য",
        "subtitle": "Websites and e-stores built to be found, understood, and acted on.",
        "web": "Website Development",
        "web_desc": "SEO-friendly informative and corporate sites that explain what you do and reach the right audience.",
        "mobile": "E-store",
        "mobile_desc": "SEO-friendly online stores designed for discovery, browsing, and checkout.",
        "view_package": "View package"
      },
      "blog": {
        "title": "ব্লগ",
        "read_more": "আরও পড়ুন",
        "subtitle": "কমিউনিটি থেকে অন্তর্দৃষ্টি, আপডেট এবং গল্প।",
        "p1_title": "কেন প্রথম হাতের উত্তর সাধারণ পরামর্শের চেয়ে ভালো",
        "p1_excerpt": "ইন্টারনেট তত্ত্ব দিয়ে পূর্ণ। আমরা এই প্ল্যাটফর্মটি তৈরি করেছি কারণ আমরা বুঝতে পেরেছিলাম যে অনুসরণ করার মতো একমাত্র পরামর্শ আসে এমন একজনের কাছ থেকে যিনি সত্যিই সেখানে ছিলেন।",
        "p2_title": "'Proven' যাচাইকরণ সিস্টেম কীভাবে কাজ করে",
        "p2_excerpt": "আমাদের যাচাইকরণ অ্যালগরিদমের একটি গভীর ডুব এবং কেন আমরা সেরা উত্তর নির্ধারণের জন্য শুধুমাত্র সাধারণ আপভোটের উপর নির্ভর করি না।",
        "p3_title": "কমিউনিটি স্পটলাইট: অনথিভুক্ত সমাধান",
        "p3_excerpt": "তিনটি দৃষ্টান্ত হাইলাইট করা যেখানে আমাদের সম্প্রদায় অস্পষ্ট সমস্যার সমাধান করেছে যার ওয়েবে অন্য কোথাও শূন্য ডকুমেন্টেশন ছিল।"
      },
      "footer": {
        "terms": "শর্তাবলী",
        "privacy": "গোপনীয়তা",
        "help": "সাহায্য",
        "copyright": "The Proven X. কমিউনিটি যাচাইকৃত উত্তর।"
      }
    }
  },
  "tr": {
    "translation": {
        "how_it_works": {
          "eyebrow": "Nasıl çalışır",
          "headline": "Bir cevap nasıl kanıtlanır",
          "muted": "Dört adım, ve sadece sonuncusu Kanıtlanmış işaretini verir.",
          "step1": {
            "title": "Bir soru sorulur",
            "copy": "Birisi karşılaştığı gerçek bir durumu anlatır."
          },
          "step2": {
            "title": "Bunu yaşayanlar cevaplar",
            "copy": "Her cevap bunun ne zaman ve nerede olduğunu söyler."
          },
          "step3": {
            "title": "Soran kişi birini seçer",
            "copy": "Bir cevap gerçekten yardımcı olan olarak işaretlenir."
          },
          "step4": {
            "title": "Topluluk oylar",
            "copy": "Bu cevabı faydalı bulan kişilerden 8 onay."
          }
        },
      "nav": {
        "home": "Ana Sayfa",
        "tags": "Etiketler",
        "search": "Ara",
        "contributors": "Katkıda Bulunanlar",
        "admin": "Yönetici",
        "ask": "Soru Sor",
        "sign_in": "Giriş Yap",
        "who_we_are": "Biz Kimiz",
        "about": "Hakkımızda",
        "products": "Ürünler",
        "blog": "Blog",
        "sign_out": "Çıkış Yap"
      },
      "home": {
        "title": "Bunu gerçekten yaşamış kişilerin cevapları",
        "subtitle": "Buradaki her cevap birinci elden bir hesaptır. Aynı şeyi yapan diğer insanlar onaylayana kadar hiçbir şey Kanıtlanmış olarak işaretlenmez.",
        "topVerifiers": "Bu ayın en iyi doğrulayıcıları",
        "newest": "En Yeni",
        "active": "Aktif",
        "votes": "Oylar",
        "unanswered": "Cevapsız",
        "pinned": "Sabitlenmiş",
        "category_prefix": "Kategori: ",
        "tag_prefix": "Etiket: ",
        "top_questions": "Popüler Sorular",
        "categories": "Kategoriler",
        "all_categories": "Tüm kategoriler",
        "community_pulse": "Topluluk Nabzı",
        "popular_tags": "Popüler Etiketler",
        "view_all_tags": "Tüm etiketleri gör →",
        "empty_state": {
          "title": "Soru bulunamadı",
          "desc": "Filtrelerinizi ayarlamayı deneyin veya bu konu hakkında soru soran ilk kişi siz olun.",
          "clear": "Filtreleri Temizle"
        },
        "stats": {
          "questions": "Sorular",
          "answers": "Cevaplar",
          "members": "Üyeler"
        }
      },
      "question": {
        "ask_title": "Soru Sor",
        "title_label": "Başlık",
        "body_label": "Detaylar",
        "tags_label": "Etiketler",
        "submit": "Gönder",
        "translation_original": "Orijinal",
        "translation_en": "İngilizce",
        "translation_ar": "Arapça",
        "accept": "Kabul Et",
        "accepted": "Kabul Edilen Cevap",
        "views": "görüntülenme",
        "answers": "cevap",
        "vote_up": "Katılıyorum",
        "vote_down": "Katılmıyorum",
        "related": "İlgili",
        "answer_this": "Cevabınız",
        "post_answer": "Cevabı Gönder",
        "add_comment": "Yorum ekle...",
        "submit_comment": "Gönder",
        "report": "Bildir"
      },
      "profile": {
        "reputation": "İtibar",
        "badges": "Rozetler",
        "activity": "Aktivite",
        "edit": "Düzenle",
        "save": "Kaydet",
        "display_name": "Takma ad",
        "bio": "Hakkımda",
        "questions": "Sorular",
        "answers": "Cevaplar"
      },
      "search": {
        "placeholder": "Ara...",
        "results": "Sonuçlar",
        "no_results": "Sonuç bulunamadı.",
        "filter_unanswered": "Sadece cevapsızlar"
      },
      "admin": {
        "title": "Yönetim",
        "flags": "Şikayetler",
        "users": "Kullanıcılar",
        "tags": "Etiketler",
        "transactions": "İşlemler",
        "dismiss": "Yoksay",
        "remove": "Kaldır",
        "suspend": "Askıya Al",
        "restore": "Geri Getir"
      },
      "notifications": {
        "title": "Bildirimler",
        "mark_all_read": "Tümünü okundu işaretle",
        "empty": "Yeni bildirim yok"
      },
      "common": {
        "loading": "Yükleniyor...",
        "error": "Hata",
        "retry": "Tekrar Dene",
        "save": "Kaydet",
        "cancel": "İptal",
        "next": "İleri",
        "prev": "Geri",
        "showing": "{{total}} kayıttan {{start}} ile {{end}} arası gösteriliyor"
      },
      "flag": {
        "title": "Bildir",
        "reason": "Sebep",
        "submit": "Gönder"
      },
      "about": {
        "title": "The Proven X Hakkında",
        "story_title": "Hikayemiz",
        "story_body": "The Proven X basit bir nedenden dolayı kuruldu: genel tavsiyeler işe yaramıyor. Biz bu deneyimi gerçekten yaşamış insanlardan cevaplar istiyoruz.",
        "promise_title": "Sözümüz",
        "promise_body": "Aynı şeyi yapan diğer insanlar onaylayana kadar hiçbir şey Kanıtlanmış olarak işaretlenmez. Teori yok, sadece doğrulanmış deneyim.",
        "ads_title": "Reklam",
        "ads_body": "Son derece ilgili, güvenen bir kitleye ulaşın. Topluluğumuz her şeyden önce özgünlüğe değer verir.",
        "ads_cta": "Bizimle reklam verin",
        "sponsor_form": {
          "title": "Bizimle reklam verin",
          "subtitle": "Bize şirketinizden bahsedin, kısa süre içinde size dönelim.",
          "company": "Şirket",
          "contact_name": "İletişim adı",
          "email": "E-posta",
          "budget": "Aylık bütçe",
          "budget_placeholder": "Bütçe aralığı seçin",
          "budget_under_1k": "1.000 $ altı",
          "budget_1k_5k": "1.000 $ – 5.000 $",
          "budget_5k_20k": "5.000 $ – 20.000 $",
          "budget_over_20k": "20.000 $ üzeri",
          "budget_undecided": "Henüz belli değil",
          "message": "Mesaj",
          "message_placeholder": "Hedefleriniz ve kitleniz hakkında bize bilgi verin...",
          "submit": "Talebi gönder",
          "success": "Teşekkürler! Yakında iletişime geçeceğiz.",
          "error": "Bir şeyler ters gitti. Lütfen tekrar deneyin."
        },
        "sponsorship": "Sponsorluk",
        "active_members": "Aktif Üyeler",
        "verified_answers": "Doğrulanmış Cevaplar",
        "questions_asked": "Sorulan Sorular",
        "trust_rate": "Güven Oranı"
      },
      "products": {
        "title": "Ürünlerimiz",
        "subtitle": "Websites and e-stores built to be found, understood, and acted on.",
        "web": "Website Development",
        "web_desc": "SEO-friendly informative and corporate sites that explain what you do and reach the right audience.",
        "mobile": "E-store",
        "mobile_desc": "SEO-friendly online stores designed for discovery, browsing, and checkout.",
        "view_package": "View package"
      },
      "blog": {
        "title": "Blog",
        "read_more": "Devamını Oku",
        "subtitle": "Topluluktan içgörüler, güncellemeler ve hikayeler.",
        "p1_title": "Neden Birinci Elden Cevaplar Genel Tavsiyelerden Daha İyidir?",
        "p1_excerpt": "İnternet teorilerle dolu. Bu platformu kurduk çünkü takip etmeye değer tek tavsiyenin o durumu gerçekten yaşamış birinden geldiğini fark ettik.",
        "p2_title": "'Proven' Doğrulama Sistemi Nasıl Çalışır?",
        "p2_excerpt": "Doğrulama algoritmamıza derinlemesine bir bakış ve neden en iyi cevabı belirlemek için sadece basit oylara güvenmiyoruz.",
        "p3_title": "Topluluk Gündemi: Belgesiz Olanı Çözmek",
        "p3_excerpt": "Topluluğumuzun web'de başka hiçbir yerde belgelenmemiş karmaşık sorunları çözdüğü üç durumu vurguluyoruz."
      },
      "footer": {
        "terms": "Şartlar",
        "privacy": "Gizlilik",
        "help": "Yardım",
        "copyright": "The Proven X. Topluluk tarafından doğrulanan cevaplar."
      }
    }
  }
};

const i18nInstance = i18n.use(initReactI18next);

// Browser language detection touches `window` — skip during SSR/prerender.
if (typeof window !== "undefined") {
  i18nInstance.use(LanguageDetector);
}

i18nInstance.init({
  resources,
  lng: "en",
  fallbackLng: "en",
  supportedLngs: [
    "en",
    "ar",
    "tl",
    "hi",
    "zh",
    "fr",
    "es",
    "ru",
    "uk",
    "fa",
    "ur",
    "bn",
    "tr",
  ],
  interpolation: {
    escapeValue: false,
  },
  detection: {
    // Prefer a saved choice; otherwise stay on English.
    order: ["localStorage"],
    caches: ["localStorage"],
  },
});

export const isRTL = (lng: string) => ['ar', 'fa', 'ur'].includes(lng);

export default i18n;
