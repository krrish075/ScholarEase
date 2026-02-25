const fs = require('fs');
const path = require('path');

const realScholarships = [
    // ENGINEERING / TECHNICAL
    {
        id: 101, name: "ONGC Scholarship to Meritorious SC/ST Students", type: "PSU", stream: "Engineering",
        category: ["SC", "ST"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 450000, min_percentage: 60, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "ONGC offers scholarships to meritorious students from SC/ST communities to pursue professional courses in Engineering and MBBS.",
        benefits: ["₹48,000 per annum"], seats: 1000, previous_cutoff: "60% in Class 12",
        documents: ["Caste Certificate", "Income Certificate", "Class 12 Marksheet", "Admission Proof"],
        official_link: "https://ongcscholar.org/", dates: { start: "2026-07-01", end: "2026-10-31" }
    },
    {
        id: 102, name: "Siemens Scholarship Program", type: "Corporate", stream: "Engineering",
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1"],
        income_limit: 200000, min_percentage: 60, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Aimed at helping deserving students from low-income families pursue engineering degrees with holistic development support.",
        benefits: ["Tuition Fees waiver", "Allowances for books", "Mentorship"], seats: 150, previous_cutoff: "60% in Class 10 & 12",
        documents: ["Income Proof", "Class 10 & 12 Marksheets", "Engineering Admission Proof"],
        official_link: "https://www.siemens.co.in/scholarship", dates: { start: "2026-08-01", end: "2026-09-30" }
    },
    {
        id: 103, name: "AICTE Pragati Scholarship for Girls", type: "Government", stream: "Engineering",
        category: ["General", "OBC", "SC", "ST"], education_level: ["Undergraduate", "Diploma"], year_of_study: ["1", "2"],
        income_limit: 800000, min_percentage: 0, gender: "Female", state: "All India", is_minority: false, is_pwd: false,
        description: "Empowering girls providing financial assistance to pursue technical education. Maximum two girls per family.",
        benefits: ["₹50,000 per annum"], seats: 5000, previous_cutoff: "Merit based on qualifying examination",
        documents: ["Aadhaar Card", "Income Certificate", "Admission Letter", "Bank Details"],
        official_link: "https://scholarships.gov.in/", dates: { start: "2026-08-15", end: "2026-11-30" }
    },
    {
        id: 104, name: "Keep India Smiling Foundational Scholarship", type: "Corporate", stream: "Engineering",
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 500000, min_percentage: 60, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Colgate-Palmolive (India) initiative providing foundational support to deserving students pursuing engineering.",
        benefits: ["₹30,000 per annum for 4 years"], seats: 200, previous_cutoff: "60% in Class 12",
        documents: ["Identity Proof", "Address Proof", "Income Document", "Class 12 Marksheet"],
        official_link: "https://www.buddy4study.com/", dates: { start: "2026-03-01", end: "2026-06-30" }
    },
    {
        id: 105, name: "Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship", type: "State Govt", stream: "Engineering",
        category: ["SC"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 0, min_percentage: 75, gender: "All", state: "Maharashtra", is_minority: false, is_pwd: false,
        description: "MahaDBT scheme providing financial assistance to SC students securing 75% and above marks in Class 10/12.",
        benefits: ["₹3000 per month for 10 months"], seats: 5000, previous_cutoff: "75% in SSC/HSC",
        documents: ["Caste Certificate", "Domecile Certificate (Maharashtra)", "SSC/HSC Marksheet"],
        official_link: "https://mahadbt.maharashtra.gov.in/", dates: { start: "2026-10-01", end: "2026-03-31" }
    },

    // MEDICAL
    {
        id: 201, name: "Nationwide Education and Scholarship Test (NEST)", type: "Private", stream: "Medical",
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1", "2"],
        income_limit: 0, min_percentage: 0, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "NEST is a scholarship exam designed to test science students' knowledge and award top performers pursuing MBBS/BAMS.",
        benefits: ["₹35,000 to top scorers"], seats: 50, previous_cutoff: "Exam Rank Based",
        documents: ["College ID Card", "Passport Photo", "Application Form"],
        official_link: "http://www.nest.net.in/", dates: { start: "2026-04-01", end: "2026-06-30" }
    },
    {
        id: 202, name: "L'Oréal India For Young Women In Science", type: "Corporate", stream: "Medical",
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1"],
        income_limit: 600000, min_percentage: 85, gender: "Female", state: "All India", is_minority: false, is_pwd: false,
        description: "An initiative to support young women pursuing graduation in science streams including Medical (MBBS/BDS).",
        benefits: ["₹2,50,000 paid in installments"], seats: 50, previous_cutoff: "85% in PCB/PCM",
        documents: ["Class 12 Marksheet with Science", "Income Proof", "Age Proof"],
        official_link: "https://www.loreal.com/en/india/", dates: { start: "2026-08-01", end: "2026-10-15" }
    },
    {
        id: 203, name: "Dr. Panjabrao Deshmukh Hostel Maintenance Allowance", type: "State Govt", stream: "Medical",
        category: ["General", "OBC"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4", "5"],
        income_limit: 800000, min_percentage: 0, gender: "All", state: "Maharashtra", is_minority: false, is_pwd: false,
        description: "MahaDBT scheme offering hostel maintenance allowance to students of registered labor and marginal farmers pursuing medical degrees.",
        benefits: ["₹30,000 per year for Mumbai/Pune/Nagpur; ₹20,000 elsewhere"], seats: 2000, previous_cutoff: "N/A",
        documents: ["Registered Labor Certificate", "Hostel Bonafide", "Domicile"],
        official_link: "https://mahadbt.maharashtra.gov.in/", dates: { start: "2026-10-01", end: "2026-03-31" }
    },
    {
        id: 204, name: "Inspire Scholarship for Higher Education (SHE)", type: "Government", stream: "Medical", // Also Science
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3"],
        income_limit: 0, min_percentage: 90, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Available to top 1% students of Class 12 Boards pursuing Basic/Natural Sciences or Medical.",
        benefits: ["₹80,000 per annum"], seats: 10000, previous_cutoff: "Top 1% of respective State/Central Board",
        documents: ["Endorsement Certificate", "Class 12 Marksheet", "Advisory Note"],
        official_link: "https://online-inspire.gov.in/", dates: { start: "2026-09-01", end: "2026-11-30" }
    },
    {
        id: 205, name: "Vidyadhan Scholarship Program (Medical)", type: "NGO", stream: "Medical",
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4", "5"],
        income_limit: 200000, min_percentage: 90, gender: "All", state: "Kerala", is_minority: false, is_pwd: false, // Also other states natively, using Kerala for variety
        description: "Support for highly meritorious students from economically backwards sections pursuing MBBS.",
        benefits: ["₹10,000 to ₹60,000 per year"], seats: 100, previous_cutoff: "90% in Class 10",
        documents: ["Income Certificate", "Marklists", "Photograph"],
        official_link: "https://www.vidyadhan.org/", dates: { start: "2026-05-01", end: "2026-07-31" }
    },

    // SCIENCE / BSC
    {
        id: 301, name: "HDFC Educational Crisis Scholarship", type: "Corporate", stream: "Science",
        category: ["General"], education_level: ["Undergraduate", "Class 10", "Class 12"], year_of_study: ["All"],
        income_limit: 0, min_percentage: 0, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Aims to help students whose families are facing a sudden financial crisis preventing them from studying.",
        benefits: ["₹10,000 to ₹25,000"], seats: 500, previous_cutoff: "N/A",
        documents: ["Proof of Crisis (Death/Job Loss)", "Fee Receipt", "Marklists"],
        official_link: "https://www.hdfcbank.com/personal/about-us/csr", dates: { start: "2026-06-01", end: "2026-08-31" }
    },
    {
        id: 302, name: "Narotam Sekhsaria Scholarship for Higher Studies", type: "NGO", stream: "Science",
        category: ["General"], education_level: ["Undergraduate", "PG"], year_of_study: ["3"],
        income_limit: 0, min_percentage: 60, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Merit-based interest-free loan scholarships for Indian students with consistently high academic records.",
        benefits: ["Interest-Free Loan up to ₹20 Lakhs"], seats: 100, previous_cutoff: "Merit Assessment",
        documents: ["Acceptance Letter", "Academic Transcripts", "Statement of Purpose"],
        official_link: "https://pg.nsfoundation.co.in/", dates: { start: "2026-01-01", end: "2026-03-24" }
    },
    {
        id: 303, name: "Post Matric Scholarship to VJNT, SBC and OBC Students", type: "State Govt", stream: "Science",
        category: ["OBC", "VJNT", "SBC"], education_level: ["Undergraduate", "Diploma"], year_of_study: ["1", "2", "3"],
        income_limit: 150000, min_percentage: 0, gender: "All", state: "Maharashtra", is_minority: false, is_pwd: false,
        description: "MahaDBT post matric scholarship providing maintenance allowance and fee reimbursement.",
        benefits: ["Maintenance Allowance + Mandatory Fees Reimbursement"], seats: 10000, previous_cutoff: "N/A",
        documents: ["Caste Certificate", "Income Certificate", "Fee Receipt", "Domicile"],
        official_link: "https://mahadbt.maharashtra.gov.in/", dates: { start: "2026-10-01", end: "2026-03-31" }
    },
    {
        id: 304, name: " Santoor Women's Scholarship", type: "Corporate", stream: "Science", // Can be other arts/commerce too
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3"],
        income_limit: 0, min_percentage: 0, gender: "Female", state: "Karnataka", is_minority: false, is_pwd: false, // AP, Karnataka, Telangana
        description: "Specifically supports young women from disadvantaged backgrounds who wish to pursue higher education after grade 12.",
        benefits: ["₹24,000 per annum"], seats: 900, previous_cutoff: "Passed Class 10 & 12 from Govt Schools",
        documents: ["Class 10/12 Govt School Certificate", "Aadhaar", "Bank Details"],
        official_link: "https://www.santoorscholarships.com/", dates: { start: "2026-08-01", end: "2026-09-30" }
    },
    {
        id: 305, name: "Kishore Vaigyanik Protsahan Yojana (KVPY)", type: "Government", stream: "Science",
        category: ["General"], education_level: ["Class 11", "Class 12", "Undergraduate"], year_of_study: ["1", "2", "3"],
        income_limit: 0, min_percentage: 75, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "National program of fellowship in Basic Sciences to attract highly motivated students for pursuing basic science courses and research career.",
        benefits: ["₹5,000 to ₹7,000 monthly fellowship + contingency grant"], seats: 2000, previous_cutoff: "Aptitude Test Rank",
        documents: ["Aptitude Test Admit Card", "Marklists", "Category Certificate"],
        official_link: "http://www.kvpy.iisc.ernet.in/", dates: { start: "2026-07-01", end: "2026-09-06" } // Note: KVPY is technically subsumed by INSPIRE now, but good for demo
    },

    // COMMERCE / ARTS
    {
        id: 401, name: "IDFC FIRST Bank MBA Scholarship", type: "Corporate", stream: "Commerce",
        category: ["General"], education_level: ["Undergraduate", "PG"], year_of_study: ["1", "2"],
        income_limit: 600000, min_percentage: 0, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Financial support to pursuing MBA from an Indian institution.",
        benefits: ["₹1,00,000 per annum"], seats: 150, previous_cutoff: "N/A",
        documents: ["MBA Admission Offer Letter", "Fee structure", "Income Proof"],
        official_link: "https://www.idfcfirstbank.com/csr/education", dates: { start: "2026-06-01", end: "2026-07-31" }
    },
    {
        id: 402, name: "Cultural Talent Search Scholarship Scheme", type: "Government", stream: "Arts",
        category: ["General"], education_level: ["Class 10", "Class 12"], year_of_study: ["All"],
        income_limit: 0, min_percentage: 0, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Offered by CCRT for outstanding children specializing in traditional art forms.",
        benefits: ["₹3,600 per year + Tuition Fee Reimbursement"], seats: 650, previous_cutoff: "Talent Assessment",
        documents: ["Birth Certificate", "Guru's Recommendation", "Proof of Training"],
        official_link: "http://ccrtindia.gov.in/scholarship.php", dates: { start: "2026-11-01", end: "2026-12-31" }
    },
    {
        id: 403, name: "G.P. Birla Educational Scholarship", type: "Private", stream: "Commerce", // Also Arts/Sci
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 300000, min_percentage: 80, gender: "All", state: "West Bengal", is_minority: false, is_pwd: false,
        description: "For meritorious students of West Bengal who have passed Class 12 and evaluating pursuing higher education.",
        benefits: ["₹50,000 per year"], seats: 100, previous_cutoff: "80% in State Board or 85% in Central Board (WB)",
        documents: ["Marksheet", "Income Proof", "Admission Proof"],
        official_link: "http://www.gpbirlaedufoundation.com/", dates: { start: "2026-07-01", end: "2026-08-15" }
    },
    {
        id: 404, name: "Siksha Abhiyan Scholarship", type: "NGO", stream: "Arts",
        category: ["General"], education_level: ["Class 10", "Class 12", "Undergraduate"], year_of_study: ["All"],
        income_limit: 0, min_percentage: 0, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Initiative of Modi Foundation for students from Class 8 to 12. Also applicable to degree students.",
        benefits: ["Up to ₹50,000 based on category"], seats: 500, previous_cutoff: "N/A",
        documents: ["Aadhaar Card", "Photograph", "Previous Year Marksheet"],
        official_link: "https://www.buddy4study.com/", dates: { start: "2026-01-01", end: "2026-03-31" }
    },
    {
        id: 405, name: "Government of India Post-Matric Scholarship for SC Students", type: "Government", stream: "Commerce",
        category: ["SC"], education_level: ["Undergraduate", "PG"], year_of_study: ["1", "2", "3"],
        income_limit: 250000, min_percentage: 0, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Provides financial assistance to SC students studying at post matriculation or post-secondary stage.",
        benefits: ["Maintenance Allowance & Full Fee Concession"], seats: 50000, previous_cutoff: "Must be a recognized insitution student",
        documents: ["Caste Certificate", "Income Certificate", "Aadhaar Card", "Bank Passbook"],
        official_link: "https://scholarships.gov.in/", dates: { start: "2026-08-01", end: "2026-11-30" }
    },

    // SCHOOL / GENERAL / DIPLOMA
    {
        id: 501, name: "Begum Hazrat Mahal National Scholarship", type: "Government", stream: "School",
        category: ["Minority"], education_level: ["Class 10", "Class 11", "Class 12"], year_of_study: ["All"],
        income_limit: 200000, min_percentage: 50, gender: "Female", state: "All India", is_minority: true, is_pwd: false,
        description: "For meritorious girl students belonging to minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi).",
        benefits: ["₹5,000 for Class 9/10, ₹6,000 for Class 11/12"], seats: 50000, previous_cutoff: "50% in previous exam",
        documents: ["Minority Certificate", "Income Certificate", "Aadhaar", "Previous Marksheet"],
        official_link: "https://scholarships.gov.in/", dates: { start: "2026-09-01", end: "2026-10-31" }
    },
    {
        id: 502, name: "CBSE Single Girl Child Scholarship", type: "Government", stream: "School",
        category: ["General"], education_level: ["Class 11", "Class 12"], year_of_study: ["1", "2"],
        income_limit: 0, min_percentage: 60, gender: "Female", state: "All India", is_minority: false, is_pwd: false,
        description: "For parents who have only one girl child. Students who have passed Class 10 from CBSE schools with 60% are eligible.",
        benefits: ["₹500 per month for 2 years (Class 11 & 12)"], seats: 10000, previous_cutoff: "60% in Class 10 Boards",
        documents: ["Affidavit on Rs. 50 Stamp Paper", "Class 10 Marksheet", "Principal's Signature Form"],
        official_link: "https://cbse.gov.in/cbsenew/scholarships.html", dates: { start: "2026-09-15", end: "2026-10-31" }
    },
    {
        id: 503, name: "NSP Pre Matric Scholarship Scheme for Minorities", type: "Government", stream: "School",
        category: ["Minority"], education_level: ["Class 10"], year_of_study: ["All"],
        income_limit: 100000, min_percentage: 50, gender: "All", state: "All India", is_minority: true, is_pwd: false,
        description: "To encourage parents from minority communities to send their school-going children to school and reduce drops-outs.",
        benefits: ["Admission Fee, Tuition Fee, and Maintenance Allowance"], seats: 3000000, previous_cutoff: "50% in previous final examination",
        documents: ["Income Certificate", "Minority Certificate/Declaration", "Bank Details"],
        official_link: "https://scholarships.gov.in/", dates: { start: "2026-08-01", end: "2026-10-31" }
    },
    {
        id: 504, name: "Post-Matric Scholarship for Persons with Disabilities (PwD)", type: "Government", stream: "General Degree",
        category: ["General"], education_level: ["Class 11", "Class 12", "Undergraduate", "PG", "Diploma"], year_of_study: ["1", "2", "3", "4", "5"],
        income_limit: 250000, min_percentage: 0, gender: "All", state: "All India", is_minority: false, is_pwd: true,
        description: "Financial assistance to students with verified disabilities studying at post matriculation level.",
        benefits: ["Maintenance Allowance, Book Grant, Disability Allowance"], seats: 17000, previous_cutoff: ">40% Disability",
        documents: ["Disability Certificate (UDID)", "Income Certificate", "Photograph"],
        official_link: "https://scholarships.gov.in/", dates: { start: "2026-08-15", end: "2026-11-30" }
    },
    {
        id: 505, name: "Rajarshi Shahu Maharaj Shikshan Shulk Yojna (EBC)", type: "State Govt", stream: "Engineering",
        category: ["General", "OBC"], education_level: ["Undergraduate", "Diploma"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 800000, min_percentage: 0, gender: "All", state: "Maharashtra", is_minority: false, is_pwd: false,
        description: "MahaDBT scheme providing tuition fee and exam fee reimbursement to Economically Backward Class students.",
        benefits: ["50% Tuition Fees and 50% Exam Fees Reimbursement"], seats: 50000, previous_cutoff: "Must be admitted through CAP rounds",
        documents: ["CAP Round Allotment Letter", "Income Certificate (Tahsildar)", "Domicile Certificate"],
        official_link: "https://mahadbt.maharashtra.gov.in/", dates: { start: "2026-10-01", end: "2026-03-31" }
    },

    // FILLING UP TO 30+ WITH A MIX OF OTHERS
    {
        id: 601, name: "Tata Steel Millennium Scholarship", type: "Corporate", stream: "Engineering",
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 0, min_percentage: 60, gender: "All", state: "Jharkhand", is_minority: false, is_pwd: false,
        description: "Scholarship for sons/daughters/spouses of Tata Steel Employees.",
        benefits: ["₹2,400 per month"], seats: 500, previous_cutoff: "60% aggregate in Class 12",
        documents: ["Employee Personnel No.", "Marksheet", "College Admission Receipt"],
        official_link: "https://www.tatasteel.com/", dates: { start: "2026-11-01", end: "2026-12-31" }
    },
    {
        id: 602, name: "LIC Golden Jubilee Scholarship Scheme", type: "Corporate", stream: "General Degree",
        category: ["General"], education_level: ["Undergraduate", "Diploma", "Class 10"], year_of_study: ["1"],
        income_limit: 250000, min_percentage: 60, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "For students passing out of Class 10/12 to pursue higher studies in India.",
        benefits: ["₹20,000 per annum paid in 3 installments"], seats: 20, previous_cutoff: "60% in Class 10/12",
        documents: ["Income Certificate", "Marksheet", "Bank Account Proof"],
        official_link: "https://licindia.in/", dates: { start: "2026-11-01", end: "2026-12-31" }
    },
    {
        id: 603, name: "PM Yasasvi Entrance Test (PMYET)", type: "Government", stream: "School",
        category: ["OBC", "EBC"], education_level: ["Class 10", "Class 11", "Class 12"], year_of_study: ["All"],
        income_limit: 250000, min_percentage: 0, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Merit-based scholarship for OBC, EBC, and DNT students studying in Top Class Schools.",
        benefits: ["₹75,000 for Class 9/10, ₹1,25,000 for Class 11/12"], seats: 15000, previous_cutoff: "Must clear NTA Entrance Exam",
        documents: ["Aadhaar Card", "Income Certificate", "Category Certificate", "PMYET Admit/Score Card"],
        official_link: "https://yet.nta.ac.in/", dates: { start: "2026-07-11", end: "2026-08-10" }
    },
    {
        id: 604, name: "Chief Minister Merit Scholarship Scheme", type: "State Govt", stream: "Science",
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 500000, min_percentage: 80, gender: "All", state: "Delhi", is_minority: false, is_pwd: false,
        description: "Support for Delhi residents pursuing technical or professional degrees in Delhi institutions.",
        benefits: ["100% Tuition Fee subject to max ₹1 Lakh"], seats: 500, previous_cutoff: "80% in Class 12 Boards",
        documents: ["Delhi Domicile", "Income Proof", "Fee Receipt", "Marklists"],
        official_link: "http://edistrict.delhigovt.nic.in/", dates: { start: "2026-12-01", end: "2026-02-28" }
    },
    {
        id: 605, name: "Pragati Scholarship by AICTE (Diploma)", type: "Government", stream: "Diploma",
        category: ["General"], education_level: ["Diploma"], year_of_study: ["1", "2", "3"],
        income_limit: 800000, min_percentage: 0, gender: "Female", state: "All India", is_minority: false, is_pwd: false,
        description: "Empowering girls providing financial assistance to pursue technical diploma education.",
        benefits: ["₹50,000 per annum"], seats: 5000, previous_cutoff: "Merit based on qualifying examination",
        documents: ["Aadhaar", "Income Certificate", "Polytechnic Admission Letter"],
        official_link: "https://scholarships.gov.in/", dates: { start: "2026-08-15", end: "2026-11-30" }
    },
    {
        id: 606, name: "Eklavya Scholarship", type: "State Govt", stream: "Arts, Science, Commerce",
        category: ["General"], education_level: ["PG"], year_of_study: ["1", "2"],
        income_limit: 75000, min_percentage: 60, gender: "All", state: "Maharashtra", is_minority: false, is_pwd: false,
        description: "MahaDBT scheme offering financial assistance to post-graduate students scoring >60% in Arts, Commerce or Science.",
        benefits: ["₹5,000 per annum"], seats: 2000, previous_cutoff: "60% in Graduation",
        documents: ["Income Certificate", "Graduation Marksheet", "Domicile"],
        official_link: "https://mahadbt.maharashtra.gov.in/", dates: { start: "2026-10-01", end: "2026-03-31" }
    },
    {
        id: 607, name: "Swami Vivekananda Merit Cum Means Scholarship", type: "State Govt", stream: "General Degree",
        category: ["General"], education_level: ["Undergraduate", "PG", "Diploma"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 250000, min_percentage: 60, gender: "All", state: "West Bengal", is_minority: false, is_pwd: false,
        description: "Assists the meritorious students having financially backward section in West Bengal.",
        benefits: ["₹1000 to ₹8000 per month depending on course"], seats: 25000, previous_cutoff: "60% in State Board",
        documents: ["Income Certificate", "Mark Sheet", "Domicile Certificate", "Bank Passbook Front Page"],
        official_link: "https://svmcm.wbhed.gov.in/", dates: { start: "2026-09-01", end: "2026-12-31" }
    },
    {
        id: 608, name: "NEC Merit Scholarship", type: "Government", stream: "Engineering",
        category: ["General"], education_level: ["Undergraduate", "PG"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 800000, min_percentage: 60, gender: "All", state: "Assam", is_minority: false, is_pwd: false,
        description: "For students of the North Eastern Region pursuing higher professional courses like Engineering, Medical, Pharma.",
        benefits: ["₹20,000 for Degree, ₹25,000 for PG"], seats: 300, previous_cutoff: "60% marks in previous course",
        documents: ["Permanent Resident Certificate (PRC)", "Income Certificate", "Recommendation of Head of Institute"],
        official_link: "https://scholarships.gov.in/", dates: { start: "2026-08-01", end: "2026-11-30" }
    },
    {
        id: 609, name: "Vidyasiri Scholarship", type: "State Govt", stream: "General Degree",
        category: ["OBC", "SC", "ST"], education_level: ["Undergraduate", "Class 11", "Class 12"], year_of_study: ["1", "2", "3"],
        income_limit: 250000, min_percentage: 0, gender: "All", state: "Karnataka", is_minority: false, is_pwd: false,
        description: "Food and accommodation scheme for students from backward classes studying in post-matric courses.",
        benefits: ["₹1,500 per month for 10 months"], seats: 20000, previous_cutoff: "Must be studying >5kms away from home",
        documents: ["Caste Certificate", "Income Certificate", "Study Certificate"],
        official_link: "https://ssp.postmatric.karnataka.gov.in/", dates: { start: "2026-09-01", end: "2026-12-31" }
    },
    {
        id: 610, name: "Mukhyamantri Medhavi Vidyarthi Yojana (MMVY)", type: "State Govt", stream: "Engineering", // And Medical/Law
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 600000, min_percentage: 70, gender: "All", state: "Madhya Pradesh", is_minority: false, is_pwd: false,
        description: "MP Govt scheme offering fee waiver for students taking admission in professional colleges based on national exams.",
        benefits: ["Full Admission/Tuition Fee Reimbursed"], seats: 5000, previous_cutoff: "70% in MP Board or 85% in CBSE",
        documents: ["Resident Proof", "Aadhaar Card", "Class 12 Marksheet", "Income Certificate"],
        official_link: "http://scholarshipportal.mp.nic.in/MedhaviChhatra/", dates: { start: "2026-06-01", end: "2026-10-31" }
    },
    {
        id: 611, name: "Ishan Uday Special Scholarship Scheme for NER", type: "Government", stream: "General Degree",
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3"],
        income_limit: 450000, min_percentage: 0, gender: "All", state: "Assam", is_minority: false, is_pwd: false, // Applies to all NE states
        description: "UGC special scheme aimed to promote higher education in North Eastern Regions.",
        benefits: ["₹5,400 to ₹7,800 per month"], seats: 10000, previous_cutoff: "Class 12 from CBSE/ICSE/State Board in NER",
        documents: ["Domicile Certificate of NER", "Income Certificate", "Aadhaar Card", "Marksheet"],
        official_link: "https://scholarships.gov.in/", dates: { start: "2026-07-01", end: "2026-10-31" }
    },
    {
        id: 612, name: "FAEA Scholarship", type: "NGO", stream: "Arts",
        category: ["SC", "ST", "General"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3"],
        income_limit: 0, min_percentage: 0, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Foundation for Academic Excellence and Access provides sponsorships to students for undergraduate studies in Arts/Commerce/Science/Medical/Engineering.",
        benefits: ["Tuition fee, maintenance allowance or hostel/mess charges"], seats: 50, previous_cutoff: "Merit based and Interview",
        documents: ["Marksheet", "Category Certificate", "BPL Ration Card (if applicable)"],
        official_link: "http://www.faeaindia.org/", dates: { start: "2026-05-01", end: "2026-06-30" }
    },
    {
        id: 613, name: "Amity University Fast Track Admission & Scholarship", type: "Private", stream: "Engineering",
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 0, min_percentage: 88, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Merit scholarships instantly awarded during admission to top CBSE/ICSE performers.",
        benefits: ["50% to 100% Academic Fee Waiver"], seats: 500, previous_cutoff: "88%+ in Class 12 Boards",
        documents: ["Class 12 Original Marksheet"],
        official_link: "https://www.amity.edu/admissions-scholarship.aspx", dates: { start: "2026-01-01", end: "2026-08-30" }
    },

    // SPECIFIC MAHADBT FILTER MAPPINGS
    {
        id: 650, name: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna", type: "Government", stream: "Engineering",
        category: ["General", "OBC"], education_level: ["Undergraduate", "Diploma"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 800000, min_percentage: 60, gender: "All", state: "Maharashtra", is_minority: false, is_pwd: false,
        description: "MahaDBT Scholarship providing 50% tuition fee and exam fee waiver for professional Engineering courses.",
        benefits: ["50% Tuition Fee & Exam Fee Waiver"], seats: 99999, previous_cutoff: "CAP round admission",
        documents: ["Income Certificate (< 8 Lakhs)", "Domicile Certificate", "CAP Allotment Letter"],
        official_link: "https://mahadbt.maharashtra.gov.in/", dates: { start: "2026-08-01", end: "2026-11-30" }
    },
    {
        id: 651, name: "Dr. Panjabrao Deshmukh Hostel Maintenance Allowance", type: "Government", stream: "Engineering",
        category: ["General", "OBC", "SC", "ST"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 800000, min_percentage: 50, gender: "All", state: "Maharashtra", is_minority: false, is_pwd: false,
        description: "MahaDBT allowance for outstation students residing in hostels pursuing professional degrees like B.Tech.",
        benefits: ["₹30,000 allowance for MMRDA/PMRDA", "₹20,000 for other locations"], seats: 99999, previous_cutoff: "Registered Alpabhudharak/Registered Labour Child",
        documents: ["Hostel Certificate", "Alpabhudharak Certificate"],
        official_link: "https://mahadbt.maharashtra.gov.in/", dates: { start: "2026-08-01", end: "2026-11-30" }
    },
    {
        id: 652, name: "State Government Medical Scholarship", type: "Government", stream: "Medical",
        category: ["General", "OBC"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 800000, min_percentage: 60, gender: "All", state: "Maharashtra", is_minority: false, is_pwd: false,
        description: "MahaDBT financial assistance covering tuition fees for MBBS, BDS, and BAMS students.",
        benefits: ["50% Tuition Fee Reimbursement"], seats: 99999, previous_cutoff: "NEET Rank / State Merit",
        documents: ["NEET Scorecard", "Domicile Certificate", "Income Certificate"],
        official_link: "https://mahadbt.maharashtra.gov.in/", dates: { start: "2026-08-01", end: "2026-11-30" }
    },

    // EXTENDED ARTS & COMMERCE
    {
        id: 701, name: "Siksha Abhiyan Scholarship for Arts", type: "NGO", stream: "Arts",
        category: ["SC", "ST", "OBC"], education_level: ["Undergraduate", "Class 12"], year_of_study: ["1", "2", "3"],
        income_limit: 150000, min_percentage: 55, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Specialized initiative focusing on uplifting students pursuing humanities and creative arts.",
        benefits: ["₹15,000 per annum"], seats: 1000, previous_cutoff: "55% in Class 10/12",
        documents: ["Aadhaar", "Income Certificate", "Marksheet"],
        official_link: "https://www.buddy4study.com/", dates: { start: "2026-02-01", end: "2026-04-30" }
    },
    {
        id: 702, name: "ICAI Commerce Wizard Scholarship", type: "Corporate", stream: "Commerce",
        category: ["General"], education_level: ["Undergraduate", "Class 11", "Class 12"], year_of_study: ["1", "2", "3"],
        income_limit: 0, min_percentage: 0, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "A talent search exam to encourage students pursuing Commerce, CA, and financial studies.",
        benefits: ["₹1 Lakh cash prize for Top Rankers"], seats: 100, previous_cutoff: "Exam Rank",
        documents: ["Admit Card", "School ID"],
        official_link: "https://icaicommercewizard.org/", dates: { start: "2026-11-01", end: "2026-12-31" }
    },

    // EXTENDED DIPLOMA
    {
        id: 801, name: "Sitaram Jindal Foundation Scholarship (Diploma)", type: "NGO", stream: "Diploma",
        category: ["General", "OBC", "SC", "ST"], education_level: ["Diploma"], year_of_study: ["1", "2", "3"],
        income_limit: 250000, min_percentage: 60, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Financial assistance to students pursuing polytechnic/diploma courses across India.",
        benefits: ["₹1000 per month for Boys", "₹1200 per month for Girls"], seats: 99999, previous_cutoff: "60% for Boys, 55% for Girls",
        documents: ["Income Certificate", "Marksheets", "Principal Recommendation"],
        official_link: "https://www.sitaramjindalfoundation.org/", dates: { start: "2026-01-01", end: "2026-12-31" }
    },
    {
        id: 802, name: "Saksham Scholarship Scheme for Specially Abled Student", type: "Government", stream: "Diploma",
        category: ["General", "OBC", "SC", "ST"], education_level: ["Diploma", "Undergraduate"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 800000, min_percentage: 0, gender: "All", state: "All India", is_minority: false, is_pwd: true,
        description: "AICTE initiative to provide encouragement and support to specially abled children to pursue Technical Diploma/Degree.",
        benefits: ["₹50,000 per annum for study material and tuition"], seats: 1000, previous_cutoff: "Admitted to Diploma/Degree Institute",
        documents: ["Disability Certificate", "Income Certificate", "Admission Letter"],
        official_link: "https://scholarships.gov.in/", dates: { start: "2026-08-15", end: "2026-11-30" }
    },

    // EXHAUSTIVE FILTER EDGE CASES
    {
        id: 901, name: "Delhi Chief Minister's Super Talented Children Scheme", type: "State Govt", stream: "Science",
        category: ["General", "OBC", "SC", "ST"], education_level: ["Class 11", "Class 12"], year_of_study: ["1", "2"],
        income_limit: 300000, min_percentage: 80, gender: "All", state: "Delhi", is_minority: false, is_pwd: false,
        description: "Delhi Government scheme explicitly supporting top science students in state schools for JEE/NEET prep.",
        benefits: ["Free Coaching + ₹20,000 allowance"], seats: 400, previous_cutoff: "80% in Class 10 Board",
        documents: ["Delhi Domicile", "Income Proof", "Class 10 Marksheet"],
        official_link: "https://edudel.nic.in/", dates: { start: "2026-06-01", end: "2026-07-30" }
    },
    {
        id: 902, name: "Vidyasiri Scholarship (Karnataka)", type: "State Govt", stream: "Arts",
        category: ["OBC", "SC", "ST"], education_level: ["Undergraduate", "PG"], year_of_study: ["1", "2", "3"],
        income_limit: 250000, min_percentage: 50, gender: "All", state: "Karnataka", is_minority: false, is_pwd: false,
        description: "Support for backward class students studying in post-matric courses without hostel access.",
        benefits: ["₹1,500 per month for 10 months"], seats: 50000, previous_cutoff: "Passed previous exam",
        documents: ["Caste Certificate", "Income Certificate", "Bank Details"],
        official_link: "https://ssp.postmatric.karnataka.gov.in/", dates: { start: "2026-08-01", end: "2026-11-30" }
    },
    {
        id: 903, name: "Swami Vivekananda Merit Cum Means Scholarship (Boys)", type: "State Govt", stream: "Engineering",
        category: ["General", "OBC", "SC", "ST"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3", "4"],
        income_limit: 250000, min_percentage: 75, gender: "Male", state: "West Bengal", is_minority: false, is_pwd: false,
        description: "Merit scholarship explicitly assisting male students of West Bengal pursuing technical degrees.",
        benefits: ["₹60,000 per annum"], seats: 5000, previous_cutoff: "75% in State Board",
        documents: ["Income Certificate", "WB Domicile", "Admission Receipt"],
        official_link: "https://svmcm.wbhed.gov.in/", dates: { start: "2026-09-01", end: "2026-11-30" }
    },
    {
        id: 904, name: "HDFC Badhte Kadam Scholarship (Class 10)", type: "Corporate", stream: "School",
        category: ["General", "OBC", "SC", "ST"], education_level: ["Class 10"], year_of_study: ["All"],
        income_limit: 600000, min_percentage: 60, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Corporate initiative targeting students currently studying in Class 10 to prevent dropout due to finances.",
        benefits: ["₹15,000 one-time"], seats: 1500, previous_cutoff: "60% in Class 9",
        documents: ["Class 9 Marksheet", "Income Proof", "Current Year Fee Receipt"],
        official_link: "https://www.buddy4study.com/", dates: { start: "2026-04-01", end: "2026-06-30" }
    },
    {
        id: 905, name: "Reliance Foundation Undergraduate Scholarship", type: "Corporate", stream: "Commerce",
        category: ["General"], education_level: ["Undergraduate"], year_of_study: ["1"],
        income_limit: 300000, min_percentage: 85, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Highly competitive scholarship supporting India's top talent pursuing Commerce, Arts, or Science.",
        benefits: ["Up to ₹2,00,000 over degree duration"], seats: 5000, previous_cutoff: "85% in Class 12 Boards",
        documents: ["Class 12 Marks", "Income Certificate", "Reference Letter"],
        official_link: "https://www.reliancefoundation.org/", dates: { start: "2026-08-15", end: "2026-10-15" }
    },
    {
        id: 906, name: "Post Matric Scholarship for Minorities (Commerce)", type: "Government", stream: "Commerce",
        category: ["Minority"], education_level: ["Undergraduate"], year_of_study: ["1", "2", "3"],
        income_limit: 200000, min_percentage: 50, gender: "All", state: "All India", is_minority: true, is_pwd: false,
        description: "Government support for students from minority communities studying Commerce.",
        benefits: ["Admission + Tuition Fee waiver and Maintenance Allowance"], seats: 99999, previous_cutoff: "50% in previous exam",
        documents: ["Minority Declaration", "Income Proof", "Aadhaar"],
        official_link: "https://scholarships.gov.in/", dates: { start: "2026-09-01", end: "2026-11-30" }
    },
    {
        id: 907, name: "National Means Cum Merit Scholarship (NMMS)", type: "Government", stream: "School",
        category: ["General", "OBC", "SC", "ST"], education_level: ["Class 10"], year_of_study: ["All"],
        income_limit: 350000, min_percentage: 55, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Financial assistance to meritorious students of economically weaker sections to arrest their drop out at class VIII.",
        benefits: ["₹12,000 per annum"], seats: 100000, previous_cutoff: "NMMS State Selection Exam",
        documents: ["NMMS Exam clearing certificate", "Income Certificate"],
        official_link: "https://scholarships.gov.in/", dates: { start: "2026-07-01", end: "2026-10-31" }
    },
    {
        id: 908, name: "Pre-Matric Scholarship for SC Students", type: "Government", stream: "School",
        category: ["SC"], education_level: ["Class 10"], year_of_study: ["All"],
        income_limit: 250000, min_percentage: 0, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Financial assistance to children of SC category studying at pre-matriculation stage.",
        benefits: ["Monthly Maintenance Allowance + Books Grant"], seats: 99999, previous_cutoff: "N/A",
        documents: ["Caste Certificate", "Income Certificate", "Bank Details"],
        official_link: "https://scholarships.gov.in/", dates: { start: "2026-08-01", end: "2026-10-31" }
    },
    {
        id: 909, name: "State Government Arts Scholarship (Goa)", type: "State Govt", stream: "Arts",
        category: ["General"], education_level: ["Undergraduate", "PG"], year_of_study: ["1", "2", "3"],
        income_limit: 300000, min_percentage: 60, gender: "All", state: "Goa", is_minority: false, is_pwd: false,
        description: "Encouraging higher education in performing and liberal arts within the state of Goa.",
        benefits: ["₹20,000 per annum"], seats: 300, previous_cutoff: "60% aggregate in 12th Arts",
        documents: ["Goa Domicile", "Marksheet", "College ID"],
        official_link: "https://directorateofhighereducation.goa.gov.in/", dates: { start: "2026-07-15", end: "2026-09-30" }
    },
    {
        id: 910, name: "ONGC Foundation Scholarship for OBC", type: "PSU", stream: "Engineering",
        category: ["OBC"], education_level: ["Undergraduate"], year_of_study: ["1"],
        income_limit: 200000, min_percentage: 60, gender: "All", state: "All India", is_minority: false, is_pwd: false,
        description: "Corporate social responsibility initiative by ONGC explicitly providing support to OBC category students.",
        benefits: ["₹48,000 per year"], seats: 500, previous_cutoff: "60% aggregate in Class 12",
        documents: ["OBC Certificate", "Income Proof", "Admission Proof"],
        official_link: "https://www.ongcscholar.org/", dates: { start: "2026-08-01", end: "2026-10-31" }
    }
];

const generateData = () => {
    const data = {
        scholarships: realScholarships, // Inject exact array!
        exams: []
    };

    data.scholarships.forEach(s => {
        const isSchoolLevelOnly = s.education_level && s.education_level.every(level => ["Class 10", "Class 11", "Class 12"].includes(level));
        if (isSchoolLevelOnly) {
            s.year_of_study = ["None"];
        }
    });

    // Keep exams realistic as well
    const examTypes = [
        { name: "NEET", category: "Medical", books: ["NCERT Biology (Class 11 & 12)", "MTG Objective NCERT"] },
        { name: "JEE Main", category: "Engineering", books: ["Class 11 & 12 NCERT", "H.C. Verma Physics"] }
    ];

    for (let i = 0; i < 5; i++) {
        const examTemplate = examTypes[i % examTypes.length];
        const id = 1000 + i;
        data.exams.push({
            id: id,
            name: `${examTemplate.name} 2026 - Phase ${i + 1}`,
            date: `2026-05-${10 + i}`,
            info: `The ${examTemplate.name} is a premier ${examTemplate.category} entrance examination.`,
            study_materials: [],
            recommended_books: examTemplate.books,
            preparation_tips: "Focus on NCERT text books for fundamentals."
        });
    }

    return data;
};

const data = generateData();
const outputPath = path.join(__dirname, 'data', 'mockData.json');
if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Successfully generated ${data.scholarships.length} hand-crafted realistic scholarships and ${data.exams.length} exams.`);
