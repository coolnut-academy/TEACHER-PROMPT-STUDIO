# Teacher Prompt Studio

**Teachers Design. AI Builds. Students Learn.**

**Teacher Prompt Studio** เป็นเว็บแอปพลิเคชันแบบ Static (HTML5 + CSS3 + Vanilla JavaScript) ที่ช่วยครูทุกกลุ่มสาระออกแบบและจัดโครงสร้าง **Prompt คุณภาพสูง** เพื่อนำไปใช้กับ AI ที่ครูเลือกเอง (เช่น ChatGPT, Gemini, Claude หรือ Coding Agent) สำหรับสร้างเว็บแอปแบบฝึกหัดและการประเมินเฉพาะบุคคล

> **หลักการทำงานสำคัญ:** เว็บไซต์นี้ไม่ใช่ AI Chatbot ไม่ใช่เครื่องมือสร้างควิซโดยตรง และไม่เชื่อมต่อ AI API ใด ๆ ทำงานบนเบราว์เซอร์ 100% ด้วยระบบ Rule-Based Prompt Engine

---

## โครงสร้างโปรเจกต์

```text
teacher-prompt-studio/
├── index.html                  # หน้าหลัก 3-Step Workflow + Real-Time Prompt Preview
├── css/
│   └── style.css               # Design System (iOS Liquid Glass: Pearl White & Sky/Royal Blue) + Mobile-First Layout
├── js/
│   ├── lucide-icons.js         # ชุดไอคอน Lucide แบบ Offline (SVG Stroke 24x24 ไม่พึ่ง CDN)
│   ├── subject-strategies.js   # กฎกลุ่มสาระทั้ง 8 กลุ่ม + Custom, รูปแบบกิจกรรม, กลยุทธ์ A–D และ Presets
│   ├── templates.js            # แม่แบบ Prompt โครงสร้าง 10 ส่วน
│   ├── prompt-engine.js        # ระบบตรวจสอบความครบถ้วน จัดการกลยุทธ์ และประกอบ Prompt
│   └── app.js                  # ควบคุม UI 3 ขั้นตอน, LocalStorage Draft, Copy, Download .txt และ Modals
├── assets/
│   ├── favicon.svg             # ไอคอนแท็บเบราว์เซอร์
│   └── logo-mark.svg           # โลโก้หลัก
├── .nojekyll                   # ป้องกัน GitHub Pages ไม่ให้ประมวลผลผ่าน Jekyll
└── README.md                   # คู่มือการใช้งาน พัฒนาต่อ และเผยแพร่
```

---

## 1. วิธีเปิดเว็บไซต์บนเครื่อง (Local Usage)

โปรเจกต์นี้ไม่มี Dependency ภายนอก ไม่ต้องใช้ Node.js หรือขั้นตอน Build และใช้ Relative Path ทั้งหมด จึงเปิดใช้งานได้ 2 วิธี:

### วิธีที่ 1: เปิดไฟล์โดยตรง (ง่ายที่สุด)
1. ดาวน์โหลดหรือ Clone โปรเจกต์ลงในเครื่อง
2. ดับเบิลคลิกไฟล์ `index.html` เพื่อเปิดด้วย Google Chrome, Microsoft Edge, Firefox หรือ Safari

### วิธีที่ 2: เปิดผ่าน Local Static Server (สำหรับทดสอบหรือพัฒนา)
หากเครื่องมี Python ติดตั้งอยู่ สามารถรันคำสั่งในโฟลเดอร์โปรเจกต์:

```bash
python -m http.server 8080
```

จากนั้นเปิดเบราว์เซอร์ไปที่ `http://localhost:8080/`

---

## 2. วิธีนำขึ้น GitHub Repository

1. สร้าง Repository ใหม่บน [GitHub](https://github.com/) (เช่น ชื่อ `teacher-prompt-studio`)
2. เปิด Terminal ในโฟลเดอร์โปรเจกต์ แล้วรันคำสั่ง:

```bash
git add .
git commit -m "Initial release of Teacher Prompt Studio"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
git push -u origin main
```

---

## 3. วิธีเปิดใช้งาน GitHub Pages

1. ไปที่ Repository บน GitHub แล้วเลือกแท็บ **Settings**
2. ในเมนูด้านซ้ายเลือก **Pages**
3. ในหัวข้อ **Build and deployment**:
   - **Source**: เลือก `Deploy from a branch`
   - **Branch**: เลือก `main` และโฟลเดอร์ `/ (root)` แล้วกด **Save**
4. รอประมาณ 1–2 นาที ระบบจะแสดง URL สำหรับเข้าใช้งาน เช่น:
   `https://<USERNAME>.github.io/<REPO_NAME>/`

> ไฟล์ทั้งหมดในโปรเจกต์ใช้ Relative Path (`css/style.css`, `js/...`, `assets/...`) และมี `.nojekyll` รองรับการ Deploy ภายใต้ Subpath ของ GitHub Pages โดยอัตโนมัติ

---

## 4. วิธีเพิ่มรายวิชาหรือกลยุทธ์ใหม่

การเพิ่มรายวิชาใหม่ทำได้โดยแก้ไขไฟล์ **`js/subject-strategies.js`** เพียงไฟล์เดียว ไม่จำเป็นต้องแก้ไขโค้ดของ Prompt Engine:

1. เปิด `js/subject-strategies.js` และค้นหาอาร์เรย์ `SUBJECT_GROUPS`
2. เลือกกลุ่มสาระที่ต้องการ (เช่น `science`, `social`, `thai`, `math` ฯลฯ)
3. เพิ่มรายการวิชาในอาร์เรย์ `subjects`:

```javascript
{ id: 'ดาราศาสตร์', label: 'ดาราศาสตร์', strategy: 'hybrid' }
```

- ค่า `strategy` ที่รองรับได้แก่ `'numerical'`, `'contextual'`, `'case-based'`, `'hybrid'`
- หากต้องการเพิ่ม **Preset** ใหม่ ให้เพิ่ม Object ในอาร์เรย์ `PRESETS` ภายในไฟล์เดียวกัน
- หากต้องการปรับกฎหรือคำแนะนำเชิงวิชาการของกลุ่มสาระ ให้แก้ไขใน `academicRules` ของกลุ่มนั้น

---

## 5. วิธีแก้ไขแม่แบบ Prompt

แม่แบบข้อความ Prompt ทั้ง 10 ส่วนอยู่ในไฟล์ **`js/templates.js`**:

- `buildRoleSection(ctx)` — บทบาทของ AI
- `buildTeachingContextSection(ctx)` — บริบทการสอน
- `buildObjectivesSection(ctx)` — จุดประสงค์การเรียนรู้
- `buildAcademicSpecsSection(ctx)` — ข้อกำหนดด้านวิชาการ
- `buildQuestionFormatSection(ctx)` — รูปแบบโจทย์และการโต้ตอบ
- `buildPersonalizedStrategySection(ctx)` — กลยุทธ์สร้างโจทย์เฉพาะบุคคลและการตรวจความซ้ำ
- `buildAssessmentCriteriaSection(ctx)` — เกณฑ์การประเมินและพฤติกรรมเฉลย
- `buildTechnicalRequirementsSection(ctx)` — ข้อกำหนดทางเทคนิคและข้อจำกัด Static Web
- `buildStudentAndTeacherExperienceSection(ctx)` — ประสบการณ์นักเรียนและโหมดครู
- `buildVerificationChecklistSection(ctx)` — เงื่อนไขตรวจสอบตนเองของ AI

หากต้องการปรับกติกาการ Validate ช่องข้อมูลหรือการแจ้งเตือนเชิงครุศาสตร์ สามารถแก้ไขได้ที่ `validateState(state)` ในไฟล์ **`js/prompt-engine.js`**

---

## 6. ข้อจำกัดด้านความปลอดภัยและการตรวจประเมินแบบ Static

เว็บไซต์นี้และเว็บแอปที่ AI สร้างขึ้นตาม Prompt ทำงานฝั่งเบราว์เซอร์ของผู้ใช้ทั้งหมด (Static Client-Side) จึงมีข้อจำกัดที่ครูต้องทราบ:

1. **ไม่สามารถปกปิดเฉลยได้สมบูรณ์:** โค้ด JavaScript และเฉลยทำงานบนเครื่องของผู้เรียน ผู้ที่มีความรู้ด้านเทคนิคสามารถเปิด Developer Tools เพื่อตรวจสอบโค้ดได้ เว็บแอป Static จึงไม่เหมาะสำหรับใช้เป็นระบบสอบวัดผลสำคัญที่ต้องป้องกันการทุจริต 100%
2. **ไม่มีการจัดเก็บคะแนนรวมศูนย์ฝั่งเซิร์ฟเวอร์:** เนื่องจากไม่มี Backend และ Database ระบบจึงไม่สามารถส่งคะแนนของนักเรียนทั้งห้องเข้าสู่ฐานข้อมูลกลางของครูโดยอัตโนมัติอย่างปลอดภัยและถาวรได้ (เหมาะสำหรับให้ผู้เรียนฝึกทักษะ ดูผลสะท้อนคิด หรือดาวน์โหลด/พิมพ์ใบสรุปคำตอบส่งครู)
3. **การใช้เลขที่เป็น Seed ไม่ได้การันตีว่าโจทย์ไม่ซ้ำ 100%:** โดยเฉพาะโจทย์แนวสถานการณ์หรือกรณีศึกษาที่มีคลังข้อมูลจำกัด ครูควรใช้เครื่องมือตรวจสอบใน "โหมดครู" ของแอปที่สร้างขึ้นเพื่อตรวจเลขที่ตัวอย่างหลาย ๆ เลขที่ และตรวจทานเฉลย/Rubric ก่อนนำไปใช้สอนจริงทุกครั้ง
4. **การบันทึกค่าในเครื่อง (`localStorage`):** Teacher Prompt Studio ใช้ `localStorage` เฉพาะเพื่อจำค่าแบบฟอร์มล่าสุดบนเบราว์เซอร์ของครูเท่านั้น ไม่มีการส่งข้อมูลออกไปยังเซิร์ฟเวอร์ภายนอก
