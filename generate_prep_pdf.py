import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 11 * 72 - 36, "Week 2 Evaluation Presentation — Master Rehearsal & Q&A Guide")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, 11 * 72 - 42, 8.5 * 72 - 54, 11 * 72 - 42)
            
        # Footer
        text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * 72 - 54, 36, text)
        self.drawString(54, 36, "Presenter: Wasiur Rahman Sakib | Software Engineer Intern")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 8.5 * 72 - 54, 48)
        
        self.restoreState()

def create_pdf(filename="Week_2_Evaluation_Rehearsal_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    PRIMARY = colors.HexColor("#0F172A")    # Slate 900
    SECONDARY = colors.HexColor("#0284C7")  # Sky 600
    ACCENT = colors.HexColor("#0D9488")     # Teal 600
    DARK_TEXT = colors.HexColor("#1E293B")  # Slate 800
    MUTED_TEXT = colors.HexColor("#475569") # Slate 600
    CARD_BG = colors.HexColor("#F8FAFC")    # Slate 50
    CARD_BORDER = colors.HexColor("#E2E8F0")# Slate 200
    QA_BG = colors.HexColor("#F0FDF4")      # Emerald 50
    QA_BORDER = colors.HexColor("#BBF7D0")  # Emerald 200

    # Styles
    title_style = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        alignment=TA_CENTER,
        spaceAfter=8
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
        alignment=TA_CENTER,
        spaceAfter=15
    )
    
    slide_header_style = ParagraphStyle(
        'SlideHeader',
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6
    )

    slide_sub_style = ParagraphStyle(
        'SlideSub',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=SECONDARY,
        spaceAfter=8
    )

    speech_label_style = ParagraphStyle(
        'SpeechLabel',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=ACCENT,
        spaceBefore=4,
        spaceAfter=4
    )

    speech_body_style = ParagraphStyle(
        'SpeechBody',
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=DARK_TEXT,
        alignment=TA_JUSTIFY,
        spaceAfter=6
    )

    qa_title_style = ParagraphStyle(
        'QATitle',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#15803D"),
        spaceBefore=4,
        spaceAfter=4
    )

    qa_text_style = ParagraphStyle(
        'QAText',
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK_TEXT,
        alignment=TA_JUSTIFY,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=4
    )

    story = []

    # Title Banner
    story.append(Paragraph("WEEK 2 TECHNICAL EVALUATION", title_style))
    story.append(Paragraph("Master Presentation Script & Deep-Dive Q&A Guide (Banglish)", subtitle_style))
    
    meta_data = [
        [
            Paragraph("<b>Presenter:</b> Wasiur Rahman Sakib", styles['Normal']),
            Paragraph("<b>Track:</b> 1-Month Web Dev Training", styles['Normal']),
            Paragraph("<b>Focus:</b> React 18, Hooks, MongoDB, Next.js", styles['Normal'])
        ]
    ]
    meta_table = Table(meta_data, colWidths=[170, 170, 164])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CARD_BG),
        ('BOX', (0, 0), (-1, -1), 1, CARD_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))

    def make_speech_card(speech_text):
        content = [
            Paragraph("🗣️ <b>Banglish Presentation Speech (মুখে যা বলবে):</b>", speech_label_style),
            Paragraph(speech_text, speech_body_style)
        ]
        t = Table([[content]], colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), CARD_BG),
            ('BOX', (0, 0), (-1, -1), 1, CARD_BORDER),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        return t

    def make_qa_card(qa_list):
        items = []
        for q, a in qa_list:
            items.append(Paragraph(f"<b>❓ প্রশ্ন: {q}</b>", qa_title_style))
            items.append(Paragraph(a, qa_text_style))
            items.append(Spacer(1, 4))
        
        t = Table([[items]], colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), QA_BG),
            ('BOX', (0, 0), (-1, -1), 1, QA_BORDER),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        return t

    # --- SLIDE 1 ---
    story.append(Paragraph("SLIDE 1: Title Slide & Introduction", slide_header_style))
    story.append(Paragraph("Badges: [React 18] [Custom Hooks] [MongoDB] [Mongoose] [Next.js] [Vite]", slide_sub_style))
    s1_speech = (
        '"Assalamu Alaikum / Good morning everyone. Ami Wasiur Rahman Sakib, Software Engineer Intern. '
        'Ajke ami amar Week 2 Technical Evaluation Presentation share korchi. '
        'Ei week-e amader main focus chilo Vanilla JS theke modern component-driven React 18 architecture, '
        'Custom Hooks, backend data persistence-er jonno MongoDB & Mongoose, ebong full-stack rendering-er jonno '
        'Next.js-e transition kora. Cholen amra step by step core modules, technical challenges ebong practical live '
        'projects gulo dekhe nei."'
    )
    story.append(make_speech_card(s1_speech))
    story.append(Spacer(1, 12))

    # --- SLIDE 2 ---
    story.append(Paragraph("SLIDE 2: Executive Overview (4 Core Modules)", slide_header_style))
    story.append(Paragraph("Modules: 1. React Paradigm | 2. State & Hooks | 3. Database Layer | 4. Full-Stack Bridge", slide_sub_style))
    s2_speech = (
        '"Week 2-te amader pura learning ta ke 4 ta main pillar-e divide kora hoyechilo: '
        '1. React Paradigm: Jekhane imperative DOM manipulation theke declarative UI ebong Virtual DOM diffing mechanism bujhechi. '
        '2. State & Hooks: State immutability-r importance, useEffect-er lifecycle sync, ebong logic reuse korar jonno Custom Hooks architecture. '
        '3. Database Layer: NoSQL MongoDB-te BSON document modeling, Mongoose schema validation ebong aggregation pipelines. '
        '4. Full-Stack Bridge: Next.js App Router-er Server vs Client components ebong robust API routes build kora. '
        'Ekhon cholen React-er core concepts deep dive kori."'
    )
    story.append(make_speech_card(s2_speech))
    story.append(Spacer(1, 14))

    # --- SLIDE 3 ---
    story.append(Paragraph("SLIDE 3: React Core & Immutability", slide_header_style))
    story.append(Paragraph("Pillars: Uni-directional Flow | Virtual DOM | State Immutability", slide_sub_style))
    s3_speech = (
        '"React-er predictability ashole 3 ta fundamental concept-er upor depend kore: '
        'Prothomoto, Uni-directional Data Flow: Props shob shomoy Parent theke Child-e down hoy, ar Child theke event callback-er '
        'maddhome state update trigger hoy. Er karone single source of truth maintain thake ebong data desync bug hoy na. '
        'Dwitiyoto, Virtual DOM: React memory-te ekta lightweight virtual UI tree rakhe. State change hole reconciliation algorithm '
        'ager tree-r shathe diff check kore, ebong real DOM-e shudhu jei part-e change hoyeche sheita batched way-te update kore. '
        'Tritiyoto, State Immutability: JS-e object ba array direct mutate korle reference same theke jay (prev === next), jar fole '
        'React re-render skip kore. Tai amra shob shomoy spread operator [...prev] ba pure methods use kori jate notun memory reference '
        'toiri hoy ebong time-travel debugging possible hoy."'
    )
    story.append(make_speech_card(s3_speech))
    story.append(Spacer(1, 8))
    
    s3_qa = [
        (
            "Props সব সময় Parent থেকে Child-এ down হয় কেন?",
            "<b>Predictability & Single Source of Truth:</b> ডাটা যেন পানির মতো উপর থেকে নিচে নামে। Child যদি সরাসরি Parent-এর ডাটা চেঞ্জ করতে পারতো, তবে কোন কম্পোনেন্ট কখন ডাটা পরিবর্তন করছে তা ট্র্যাক করা অসম্ভব হয়ে যেত (Spaghetti Code)। Child শুধু Read-Only প্রপস পায়, এবং পরিবর্তনের জন্য Callback ইভেন্ট পাঠায়।"
        ),
        (
            "Virtual DOM & Reconciliation কীভাবে কাজ করে? (Example)",
            "<b>Blue-print Analogy:</b> Real DOM হলো আসল বাড়ি, আর Virtual DOM হলো কাগজের ব্লু-প্রিন্ট। ১০টি আইটেমের লিস্টে যদি শুধু ৩ নম্বর আইটেম বদলায়, React মেমরিতে পুরাতন ব্লু-প্রিন্ট ও নতুন ব্লু-প্রিন্টের মধ্যে Diffing চেক করে এবং রিয়েল ব্রাউজারের DOM-এ শুধুমাত্র <code>liElement[2].textContent = 'New'</code> এক লাইনে আপডেট করে ($O(1)$ batched commit), পুরো লিস্ট পুনরায় তৈরি করে না।"
        ),
        (
            "JS-এ Object/Array direct mutate করলে Reference same থেকে যায় কেন? এবং React State কেন Immutable?",
            "<b>Heap Pointer Mechanism:</b> Object/Array হলো Reference Type যা Heap মেমরিতে থাকে এবং ভ্যারিয়েবলটি শুধু মেমরি অ্যাড্রেস পয়েন্টার ধরে রাখে (e.g. 0x0012AF)। সরাসরি <code>user.name = 'Wasiur'</code> করলে ভিতরের ডাটা বদলালেও পয়েন্টার 0x0012AF-ই থেকে যায়। React দ্রুততম গতির জন্য <b>$O(1)$ Shallow Reference Comparison</b> করে—পয়েন্টার এক থাকলে রি-রেন্ডার স্কিপ করে। তাই Spread Operator <code>{...prev}</code> দিয়ে নতুন মেমরি অ্যাড্রেস তৈরি করতে হয় যা Time-Travel Snapshots ও Concurrent Rendering সুরক্ষিত রাখে।"
        )
    ]
    story.append(make_qa_card(s3_qa))
    story.append(Spacer(1, 14))

    # --- SLIDE 4 ---
    story.append(Paragraph("SLIDE 4: Lifecycle & Custom Hooks Architecture", slide_header_style))
    story.append(Paragraph("Pillars: useEffect Sync | Cleanup Phase | Custom Hooks (useFetch, useToggle)", slide_sub_style))
    s4_speech = (
        '"Side-effects manage korar jonno React-e useEffect use hoy: '
        'Amra bujhte perechi je useEffect shudhu lifecycle na, eta ashole External System-er shathe sync korar tool—jemon '
        'API call ba browser event listeners. Dependency array control kore amra infinite loop theke bachi. '
        'Ekhane shobcheye crucial part holo Cleanup Phase. Component unmount hole ba dependency change hole amra event listener '
        'remove kori ebong active fetch request cancel kori, jate kono memory leak na thake. '
        'Ebong logic clean ar reusable rakhar jonno amra duita Custom Hook baniechi: '
        'useFetch (API data, loading, error state auto manage kore) ebong useToggle (boolean UI state ek line-e handle kore)."'
    )
    story.append(make_speech_card(s4_speech))
    story.append(Spacer(1, 8))

    s4_qa = [
        (
            "React-এ কী কী ধরণের Side-effects হয়?",
            "React কম্পোনেন্টের মূল কাজ হলো (props, state) নিয়ে পিউর JSX রিটার্ন করা। এর বাইরে ব্রাউজার ও বাইরের সিস্টেমের সাথে যা যা ইন্টারঅ্যাকশন হয় তাই Side-effect: <b>১. Data Fetching (API Requests)</b>, <b>২. Global Event Listeners (resize, scroll)</b>, <b>৩. Timers (setInterval, setTimeout)</b>, <b>৪. Browser Storage/DOM (localStorage, document.title)</b>।"
        ),
        (
            "Unmount বা Dependency চেঞ্জে আমরা Event Listener ও Fetch Request কীভাবে Cancel করি?",
            "<code>useEffect</code> থেকে <b>Cleanup Function <code>return () => { ... }</code></b> রিটার্ন করার মাধ্যমে। Event Listener-এর ক্ষেত্রে <code>window.removeEventListener</code> কল করি। Fetch Request-এর ক্ষেত্রে <b><code>AbortController</code> এবং <code>active = false</code> ফ্ল্যাগ</b> ব্যবহার করি, যাতে কম্পোনেন্ট স্ক্রিন থেকে মুছে গেলে ব্যাকগ্রাউন্ড নেটওয়ার্ক রিকোয়েস্ট ইনস্ট্যান্ট ক্যানসেল হয়ে মেমোরি লিক বন্ধ হয়।"
        ),
        (
            "Custom Hook (useFetch ও useToggle) কীভাবে বানিয়েছি?",
            "Custom Hook হলো এমন একটি সাধারণ JS ফাংশন যার নাম <code>use</code> দিয়ে শুরু হয় এবং সে অন্যান্য React Hook ব্যবহার করে। <b>useToggle:</b> <code>const [value, setValue] = useState(init); const toggle = () => setValue(p => !p); return [value, toggle];</code>। <b>useFetch:</b> data, loading, error স্টেট এবং <code>useEffect</code>-এর মধ্যে AbortController ক্লিনআপ এনক্যাপসুলেট করে <code>{ data, loading, error }</code> রিটার্ন করে।"
        )
    ]
    story.append(make_qa_card(s4_qa))
    story.append(Spacer(1, 14))

    # --- SLIDE 5 ---
    story.append(Paragraph("SLIDE 5: MongoDB, Mongoose & Next.js Foundations", slide_header_style))
    story.append(Paragraph("Pillars: MongoDB BSON | Mongoose ODM Validation | Next.js Server Components", slide_sub_style))
    s5_speech = (
        '"Client-side theke jokhon amra full-stack perspective-e gelam: '
        'Amra MongoDB-te BSON documents niye kaj korechi, embedded sub-documents ebong fast query aggregation pipeline bujhechi. '
        'Then Mongoose ODM use kore amra data validation layer add korechi—jemon strict schema typing, default values, ebong '
        'pre/post save middleware hooks. '
        'Ar Next.js-e amra Server Components-er power dekhechi, jekhane heavy logic server-e execute hoy ebong client-e '
        'zero unnecessary JavaScript bundle pass hoy, shudhu interactive part gulote client components use kora hoy."'
    )
    story.append(make_speech_card(s5_speech))
    story.append(Spacer(1, 8))

    s5_qa = [
        (
            "BSON কী এবং MongoDB-তে BSON নিয়ে কেন কাজ করি? Sub-documents ও Aggregation Pipeline কী?",
            "<b>BSON (Binary JSON):</b> JSON-এর বাইনারি রূপ যা <code>Date, ObjectId, Decimal128, Regex</code> সমর্থন করে। এটি TLV (Type-Length-Value) বাইট ফরম্যাটে থাকে, ফলে ডেটাবেস পুরো টেক্সট পার্স না করে পয়েন্টার জাম্প করে নিমিষেই স্ক্যান করতে পারে। <b>Sub-documents:</b> টেবিল JOIN এড়িয়ে একটি ডকুমেন্টের ভেতরেই রিলেটেড অবজেক্ট রেখে $O(1)$ স্পিডে ডেটা রিড করা। <b>Aggregation Pipeline:</b> ডেটাবেসের নিজস্ব C++ মেমরিতে $match, $group, $sort পাইপলাইন চালিয়ে সেকেন্ডের ভগ্নাংশে অ্যানালিটিক্স সামারি বের করা।"
        ),
        (
            "আমরা কীভাবে Mongoose ODM দিয়ে Data Validation Layer তৈরি করেছি?",
            "আমাদের <code>Task.js</code> ফাইলে Mongoose Schema দিয়ে <b>Required Custom Error Messages</b> (title), <b>Length Constraints</b> (min 2, max 120), <b>Strict Enum Whitelists</b> (status: 'todo', 'in_progress', 'review', 'done'), এবং <b>Pre-save Middleware</b> (<code>TaskSchema.pre('save', ...)</code> দিয়ে স্বয়ংক্রিয় ট্যাগ লোয়ারকেস ও ট্রিম স্যানিটাইজেশন) যোগ করেছি।"
        ),
        (
            "Next.js Server Components vs Client Components (Zero JS Bundle Example)",
            "Server Components সার্ভারে সরাসরি ডেটাবেস কুয়েরি (<code>await Task.find()</code>) করে পিউর HTML পাঠায়, ব্রাউজারে <b>০ কিলোবাইট অতিরিক্ত JS বান্ডেল</b> যায়। যেখানে ইউজারের ইন্টারঅ্যাকশন (onClick বাটন, ফর্ম ইনপুট) দরকার, শুধুমাত্র সেটুকু অংশকে <code>'use client'</code> দিয়ে আলাদা ক্লায়েন্ট কম্পোনেন্ট (e.g. <code>DeleteTaskButton.jsx</code>) বানানো হয়।"
        )
    ]
    story.append(make_qa_card(s5_qa))
    story.append(Spacer(1, 14))

    # --- SLIDE 6 ---
    story.append(Paragraph("SLIDE 6: Technical Challenges & Engineering Solutions 🌟", slide_header_style))
    story.append(Paragraph("Core Narrative: Problem Diagnosis ➡️ Architecture Solution ➡️ Production Code Location", slide_sub_style))
    s6_speech = (
        '"Eibar ashi amader face kora real-world technical blockers ebong amra kivabe egula solve korechi: '
        '1. Challenge 1: Async Race Condition. Problem: User druto click ba parameter change korle ager slow API response pore eshe '
        'notun state overwrite kore dito. Solution: useFetch.js-e active cleanup flag ebong AbortController integrate kore pending request instant abort korechi. '
        '2. Challenge 2: Direct State Array Mutation. Problem: Direct array index update korle React re-render trigger korto na ebong move history corrupt hoye jeto. '
        'Solution: App.jsx-e spread operator [...squares] ebong history.slice() use kore pure immutable snapshots ensure korechi. '
        '3. Challenge 3: Hot-Reload Connection Leaking in Next.js. Problem: Fast Refresh-e proti save-e notun MongoDB connection toiri hoye pool exhaust hoye jacchilo. '
        'Solution: lib/mongodb.js-e global._mongooseClient singleton pattern diye serverless reload-e same connection reuse korechi."'
    )
    story.append(make_speech_card(s6_speech))
    story.append(Spacer(1, 8))

    s6_qa = [
        (
            "এই ৩টি চ্যালেঞ্জের সলিউশন আমাদের কোডবেসে কোথায় কোথায় ইমপ্লিমেন্ট করা হয়েছে?",
            "<b>১. Race Condition Fix:</b> <code>react-playground/src/hooks/useFetch.js</code> (Line 8–32)।<br/>"
            "<b>২. State Mutation & Time-Travel Fix:</b> <code>react-playground/src/App.jsx</code> (Line 28–33 & 58–62)।<br/>"
            "<b>৩. DB Connection Pool Leak Fix:</b> <code>taskflow-pro/lib/mongodb.js</code> (Line 6–46)।"
        )
    ]
    story.append(make_qa_card(s6_qa))
    story.append(Spacer(1, 14))

    # --- SLIDE 7 & LIVE DEMO ---
    story.append(Paragraph("SLIDE 7: Practical Demonstration (Live Projects & Demo Script)", slide_header_style))
    story.append(Paragraph("Live Projects: Tic-Tac-Toe Arena | Custom Hooks Playground | GitHub Pages Host", slide_sub_style))
    s7_speech = (
        '"Ei shob concepts amra live code-e implement korechi: '
        '1. Tic-Tac-Toe Game: Ekhane pure 9-square immutable grid state ache, time-travel move history ache jate user jekono '
        'previous move-e jump back korte pare without losing game integrity, ebong 8 winning line check korar pure algorithm ache. '
        '2. Custom Hooks Playground: useFetch ebong useToggle-er dynamic UI demo. '
        'Pura project-tai Vite diye bundle kore GitHub Pages-e live deploy kora ache, slide-er bottom link-e click korlei direct live app access kora jabe."'
    )
    story.append(make_speech_card(s7_speech))
    story.append(Spacer(1, 6))

    demo_walkthrough = [
        (
            "🖥️ স্ক্রিন শেয়ার করে ২ মিনিটের লাইভ ডেমো দেওয়ার সময় যা বলবে:",
            "<b>১. Tic-Tac-Toe Arena:</b> বোর্ডে ২-৩টি চাল দিয়ে দেখাবে: <i>'এখানে ডিক্লেয়ারেটিভলি স্কোরবোর্ড ও স্ট্যাটাস আপডেট হচ্ছে। নিচের মুভ হিস্ট্রিতে ক্লিক করে দেখুন টাইম-ট্রাভেল করে আগের চালে চলে যাওয়া যাচ্ছে।'</i><br/>"
            "<b>২. Custom Hooks Demo:</b> User #1 ও User #2 বাটনে ক্লিক করে দেখাবে: <i>'useFetch হুক দিয়ে লাইভ API ডাটা ফেচ হচ্ছে এবং AbortController রেস কন্ডিশন আটকাচ্ছে। Show/Hide বাটনে ক্লিক করে দেখুন useToggle দিয়ে ক্লিনলি স্টেট টগল হচ্ছে।'</i><br/>"
            "<i>(নোট: স্লাইডে TaskFlow-এর কোনো নাম বা লিংক নেই, তাই লাইভ ডেমোতে শুধু এই দুটিই দেখাবে।)</i>"
        )
    ]
    story.append(make_qa_card(demo_walkthrough))
    story.append(Spacer(1, 14))

    # --- SLIDE 8 ---
    story.append(Paragraph("SLIDE 8: Engineering Principles & Best Practices", slide_header_style))
    story.append(Paragraph("Principles: 01. Declarative UI | 02. Single Source of Truth | 03. Defensive UI Flow | 04. Modular Logic", slide_sub_style))
    s8_speech = (
        '"Code quality ebong engineering standards maintain korar jonno amra 4 ta core principle follow korechi: '
        '1. Declarative UI: Direct DOM mutate na kore state-driven architecture follow kora. '
        '2. Single Source of Truth: State-ke nearest common parent-e lift-up kora jate sibling component-e data mismatch na hoy. '
        '3. Defensive UI Design: Network error ba slow internet-er jonno shob shomoy loading skeletons ebong fallback error banner ready rakha. '
        '4. Modular Logic Separation: UI view-ke dumb & pure rakhe shob complex side-effects custom hooks-e encapsulate kora."'
    )
    story.append(make_speech_card(s8_speech))
    story.append(Spacer(1, 8))

    s8_qa = [
        (
            "Engineering Principles স্লাইডটি কেন এবং আমরা কোথায় কোথায় অ্যাপ্লাই করেছি?",
            "<b>স্লাইডের উদ্দেশ্য:</b> সিনিয়র ট্রেইনারদের সামনে কোডিং ম্যাচিউরিটি ও ক্লিন আর্কিটেকচার প্রমাণ করা।<br/>"
            "<b>প্রয়োগের স্থানসমূহ:</b><br/>"
            "• <i>Declarative UI:</i> <code>App.jsx</code>-এ স্ট্যাটাস ব্যানার ও উইনার ক্যালকুলেশন।<br/>"
            "• <i>Single Source of Truth:</i> <code>App.jsx</code>-এ <code>TicTacToeGame</code> প্যারেন্টে স্কোর ও হিস্ট্রি লিফটিং।<br/>"
            "• <i>Defensive UI:</i> <code>CustomHooksDemo.jsx</code>-এ লোডিং ও এরর হ্যান্ডলিং এবং <code>mongodb.js</code>-এ অফলাইন মেমরি ফলব্যাক ইঞ্জিন।<br/>"
            "• <i>Modular Logic:</i> <code>useFetch.js</code> ও <code>useToggle.js</code>-কে UI ভিউ থেকে সম্পূর্ণ পৃথক রাখা।"
        )
    ]
    story.append(make_qa_card(s8_qa))
    story.append(Spacer(1, 14))

    # --- SLIDE 9 & 10 ---
    story.append(Paragraph("SLIDE 9: Academic Leave & Week 4 Roadmap", slide_header_style))
    story.append(Paragraph("Focus: Week 3 Midterms Consolidation ➡️ Week 4 React Native Mobile Dev & Full-Stack", slide_sub_style))
    s9_speech = (
        '"Amader upcoming schedule niye bolle: '
        'Week 3-te: Ami University Midterm Examination-er jonno approved Academic Leave-e thakbo, shathe exam-er pashe React mental models revise korbo. '
        'Week 4-e: Amra full momentum-e back korbo Advanced Next.js Full-Stack & React Native Mobile Development niye—jekhane cross-platform components, '
        'API integrations, navigation ebong live cloud backend integration complete kora hobe."'
    )
    story.append(make_speech_card(s9_speech))
    story.append(Spacer(1, 12))

    story.append(Paragraph("SLIDE 10: Conclusion & Q&A Transition", slide_header_style))
    story.append(Paragraph("Header: THANK YOU! | Questions & Live Project Walkthrough", slide_sub_style))
    s10_speech = (
        '"Dhonnobad shobaike amar presentation shonar jonno ebong mentors-der continuous guidance-er jonno. '
        'Ekhon ami apnader jekono questions ba feedback-er jonno ready achi, ebong chaile live app walkthrough dekhaite pari. Thank you sir!"'
    )
    story.append(make_speech_card(s10_speech))

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generated successfully: {filename}")

if __name__ == "__main__":
    create_pdf()
