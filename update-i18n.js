const fs = require('fs');
const path = 'artifacts/community/src/lib/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

const translations = {
  en: {
    how_it_works: {
      eyebrow: "How it works",
      headline: "How an answer gets proven",
      muted: "Four steps, and only the last one hands out the Proven mark.",
      step1: { title: "A question is asked", copy: "Someone describes a real situation they are facing." },
      step2: { title: "People who lived it answer", copy: "Each answer says when and where it happened." },
      step3: { title: "The asker picks one", copy: "One answer is marked as the one that actually helped." },
      step4: { title: "The community votes", copy: "8 confirmations from people who find this answer helpful." }
    }
  },
  ar: {
    how_it_works: {
      eyebrow: "كيف تعمل",
      headline: "كيف يتم إثبات الإجابة",
      muted: "أربع خطوات، والأخيرة فقط تمنح علامة الإثبات.",
      step1: { title: "يتم طرح سؤال", copy: "يصف شخص ما موقفًا حقيقيًا يواجهه." },
      step2: { title: "يُجيب من عاشوا التجربة", copy: "توضح كل إجابة متى وأين حدث ذلك." },
      step3: { title: "يختار السائل إحداها", copy: "يتم تمييز إجابة واحدة على أنها التي ساعدت بالفعل." },
      step4: { title: "يُصوت المجتمع", copy: "8 تأكيدات من أشخاص وجدوا هذه الإجابة مفيدة." }
    }
  },
  tl: {
    how_it_works: {
      eyebrow: "Paano ito gumagana",
      headline: "Paano napapatunayan ang isang sagot",
      muted: "Apat na hakbang, at tanging ang huli ang nagbibigay ng markang Patunayan.",
      step1: { title: "May itatanong", copy: "Inilalarawan ng isang tao ang totoong sitwasyon na kanilang hinaharap." },
      step2: { title: "Sasagot ang mga nakaranas nito", copy: "Sinasabi ng bawat sagot kung kailan at saan ito nangyari." },
      step3: { title: "Pipili ang nagtanong", copy: "May isang sagot na mamarkahan bilang ang nakatulong talaga." },
      step4: { title: "Boboto ang komunidad", copy: "8 kumpirmasyon mula sa mga taong nakitang nakatulong ang sagot na ito." }
    }
  },
  hi: {
    how_it_works: {
      eyebrow: "यह कैसे काम करता है",
      headline: "कोई उत्तर कैसे प्रमाणित होता है",
      muted: "चार कदम, और केवल अंतिम वाला 'प्रमाणित' का चिह्न देता है।",
      step1: { title: "एक प्रश्न पूछा जाता है", copy: "कोई व्यक्ति अपने सामने आने वाली एक वास्तविक स्थिति का वर्णन करता है।" },
      step2: { title: "जिन लोगों ने इसे जिया है, वे उत्तर देते हैं", copy: "हर उत्तर यह बताता है कि यह कब और कहाँ हुआ।" },
      step3: { title: "पूछने वाला एक चुनता है", copy: "एक उत्तर को उस रूप में चिह्नित किया जाता है जिसने वास्तव में मदद की।" },
      step4: { title: "समुदाय वोट करता है", copy: "8 पुष्टिकरण उन लोगों से जिन्हें यह उत्तर उपयोगी लगा।" }
    }
  },
  zh: {
    how_it_works: {
      eyebrow: "运作方式",
      headline: "一个答案是如何被验证的",
      muted: "四个步骤，只有最后一步才会赋予“已验证”标志。",
      step1: { title: "提出问题", copy: "有人描述他们正面临的真实情况。" },
      step2: { title: "经历过的人回答", copy: "每个答案都说明发生的时间和地点。" },
      step3: { title: "提问者选择一个", copy: "一个答案被标记为真正有帮助的答案。" },
      step4: { title: "社区投票", copy: "8个认为此答案有帮助的人的确认。" }
    }
  },
  fr: {
    how_it_works: {
      eyebrow: "Comment ça marche",
      headline: "Comment une réponse est prouvée",
      muted: "Quatre étapes, et seule la dernière attribue la marque Prouvé.",
      step1: { title: "Une question est posée", copy: "Quelqu'un décrit une situation réelle à laquelle il est confronté." },
      step2: { title: "Ceux qui l'ont vécu répondent", copy: "Chaque réponse indique quand et où cela s'est produit." },
      step3: { title: "L'auteur choisit", copy: "Une réponse est marquée comme étant celle qui a vraiment aidé." },
      step4: { title: "La communauté vote", copy: "8 confirmations de personnes trouvant cette réponse utile." }
    }
  },
  es: {
    how_it_works: {
      eyebrow: "Cómo funciona",
      headline: "Cómo se demuestra una respuesta",
      muted: "Cuatro pasos, y solo el último otorga la marca de Demostrado.",
      step1: { title: "Se hace una pregunta", copy: "Alguien describe una situación real a la que se enfrenta." },
      step2: { title: "Responden quienes lo vivieron", copy: "Cada respuesta dice cuándo y dónde ocurrió." },
      step3: { title: "El autor elige una", copy: "Una respuesta se marca como la que realmente ayudó." },
      step4: { title: "La comunidad vota", copy: "8 confirmaciones de personas a las que esta respuesta les resultó útil." }
    }
  },
  ru: {
    how_it_works: {
      eyebrow: "Как это работает",
      headline: "Как ответ становится проверенным",
      muted: "Четыре шага, и только последний дает знак Проверено.",
      step1: { title: "Задается вопрос", copy: "Кто-то описывает реальную ситуацию, с которой столкнулся." },
      step2: { title: "Отвечают те, кто это пережил", copy: "В каждом ответе указывается, когда и где это произошло." },
      step3: { title: "Автор выбирает один", copy: "Один ответ отмечается как тот, который действительно помог." },
      step4: { title: "Голосует сообщество", copy: "8 подтверждений от людей, которым этот ответ помог." }
    }
  },
  uk: {
    how_it_works: {
      eyebrow: "Як це працює",
      headline: "Як відповідь стає перевіреною",
      muted: "Чотири кроки, і лише останній дає знак Перевірено.",
      step1: { title: "Ставиться питання", copy: "Хтось описує реальну ситуацію, з якою зіткнувся." },
      step2: { title: "Відповідають ті, хто це пережив", copy: "У кожній відповіді вказується, коли і де це сталося." },
      step3: { title: "Автор обирає одну", copy: "Одна відповідь позначається як та, що дійсно допомогла." },
      step4: { title: "Голосує спільнота", copy: "8 підтверджень від людей, яким ця відповідь допомогла." }
    }
  },
  fa: {
    how_it_works: {
      eyebrow: "نحوه کار",
      headline: "چگونه یک پاسخ اثبات می‌شود",
      muted: "چهار مرحله، و فقط مرحله آخر نشان اثبات‌شده را می‌دهد.",
      step1: { title: "یک سوال پرسیده می‌شود", copy: "شخصی یک موقعیت واقعی را که با آن روبرو شده توصیف می‌کند." },
      step2: { title: "افرادی که آن را تجربه کرده‌اند پاسخ می‌دهند", copy: "هر پاسخ می‌گوید چه زمانی و کجا اتفاق افتاده است." },
      step3: { title: "پرسشگر یکی را انتخاب می‌کند", copy: "یک پاسخ به عنوان پاسخی که واقعاً کمک کرده علامت‌گذاری می‌شود." },
      step4: { title: "جامعه رأی می‌دهد", copy: "۸ تایید از افرادی که این پاسخ را مفید یافته‌اند." }
    }
  },
  ur: {
    how_it_works: {
      eyebrow: "یہ کیسے کام کرتا ہے",
      headline: "جواب کیسے ثابت ہوتا ہے",
      muted: "چار مراحل، اور صرف آخری مرحلہ ثابت شدہ کا نشان دیتا ہے۔",
      step1: { title: "ایک سوال پوچھا جاتا ہے", copy: "کوئی شخص ایسی حقیقی صورتحال بیان کرتا ہے جس کا وہ سامنا کر رہا ہے۔" },
      step2: { title: "جنہوں نے اسے جیا وہ جواب دیتے ہیں", copy: "ہر جواب بتاتا ہے کہ یہ کب اور کہاں ہوا۔" },
      step3: { title: "پوچھنے والا ایک چنتا ہے", copy: "ایک جواب کو اس کے طور پر نشان زد کیا جاتا ہے جس نے واقعی مدد کی۔" },
      step4: { title: "کمیونٹی ووٹ دیتی ہے", copy: "8 تصدیقات ان لوگوں کی طرف سے جنہیں یہ جواب مفید لگا۔" }
    }
  },
  bn: {
    how_it_works: {
      eyebrow: "এটি কীভাবে কাজ করে",
      headline: "একটি উত্তর কীভাবে প্রমাণিত হয়",
      muted: "চারটি ধাপ, এবং শুধুমাত্র শেষটি 'প্রমাণিত' চিহ্ন প্রদান করে।",
      step1: { title: "একটি প্রশ্ন জিজ্ঞাসা করা হয়", copy: "কেউ তাদের সম্মুখীন হওয়া একটি বাস্তব পরিস্থিতি বর্ণনা করে।" },
      step2: { title: "যারা এর মধ্য দিয়ে গেছে তারা উত্তর দেয়", copy: "প্রতিটি উত্তরে বলা হয় কখন এবং কোথায় এটি ঘটেছিল।" },
      step3: { title: "জিজ্ঞাসাকারী একটি বেছে নেয়", copy: "একটি উত্তরকে এমনভাবে চিহ্নিত করা হয় যা সত্যিই সাহায্য করেছে।" },
      step4: { title: "সম্প্রদায় ভোট দেয়", copy: "৮ জনের নিশ্চিতকরণ যারা এই উত্তরটি সহায়ক বলে মনে করেন।" }
    }
  },
  tr: {
    how_it_works: {
      eyebrow: "Nasıl çalışır",
      headline: "Bir cevap nasıl kanıtlanır",
      muted: "Dört adım, ve sadece sonuncusu Kanıtlanmış işaretini verir.",
      step1: { title: "Bir soru sorulur", copy: "Birisi karşılaştığı gerçek bir durumu anlatır." },
      step2: { title: "Bunu yaşayanlar cevaplar", copy: "Her cevap bunun ne zaman ve nerede olduğunu söyler." },
      step3: { title: "Soran kişi birini seçer", copy: "Bir cevap gerçekten yardımcı olan olarak işaretlenir." },
      step4: { title: "Topluluk oylar", copy: "Bu cevabı faydalı bulan kişilerden 8 onay." }
    }
  }
};

for (const [lang, data] of Object.entries(translations)) {
  const regex = new RegExp(`("${lang}"\\s*:\\s*{\\s*"translation"\\s*:\\s*{)`);
  
  let jsonStr = JSON.stringify({ how_it_works: data.how_it_works }, null, 2);
  let formattedStr = jsonStr.split('\n').slice(1, -1).map(line => '      ' + line).join('\n');
  
  content = content.replace(regex, `$1\n${formattedStr},`);
}

fs.writeFileSync(path, content, 'utf8');