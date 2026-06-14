// Local Database of responses covering all 17 SDG Goals
const sdgDatabase = [
    { keywords: ["poverty", "poor", "money", "goal 1"], response: "🌍 SDG Goal 1: No Poverty. End poverty in all its forms everywhere by ensuring social protection, equal rights to economic resources, and building resilience." },
    { keywords: ["hunger", "food", "eat", "agriculture", "nutrition", "goal 2"], response: "🍎 SDG Goal 2: Zero Hunger. End hunger, achieve food security and improved nutrition, and promote sustainable agriculture globally." },
    { keywords: ["health", "wellbeing", "disease", "medical", "goal 3"], response: "🏥 SDG Goal 3: Good Health and Well-being. Ensure healthy lives and promote well-being for all individuals at all ages." },
    { keywords: ["education", "school", "learn", "literacy", "goal 4"], response: "📚 SDG Goal 4: Quality Education. Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all." },
    { keywords: ["gender", "women", "equality", "girls", "sexism", "goal 5"], response: "⚖️ SDG Goal 5: Gender Equality. Achieve gender equality and empower all women and girls by eliminating all forms of discrimination and violence." },
    { keywords: ["water", "sanitation", "clean water", "hygiene", "goal 6"], response: "💧 SDG Goal 6: Clean Water and Sanitation. Ensure availability and sustainable management of safe drinking water and sanitation for all." },
    { keywords: ["energy", "solar", "electricity", "power", "fossil", "goal 7"], response: "⚡ SDG Goal 7: Affordable and Clean Energy. Ensure access to affordable, reliable, sustainable, and modern clean energy alternatives." },
    { keywords: ["work", "economy", "jobs", "growth", "employment", "goal 8"], response: "💼 SDG Goal 8: Decent Work and Economic Growth. Promote sustained, inclusive, and sustainable economic growth, full and productive employment, and decent work for all." },
    { keywords: ["industry", "innovation", "infrastructure", "factory", "build", "goal 9"], response: "🏗️ SDG Goal 9: Industry, Innovation, and Infrastructure. Build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation." },
    { keywords: ["inequality", "discrimination", "reduce gaps", "wealth gap", "goal 10"], response: "📉 SDG Goal 10: Reduced Inequalities. Reduce inequality within and among countries by promoting political, economic, and social inclusion for all." },
    { keywords: ["cities", "communities", "housing", "urban", "transport", "goal 11"], response: "🏙️ SDG Goal 11: Sustainable Cities and Communities. Make cities and human settlements inclusive, safe, resilient, and sustainable." },
    { keywords: ["consumption", "production", "waste", "recycle", "responsible", "goal 12"], response: "🔄 SDG Goal 12: Responsible Consumption and Production. Ensure sustainable consumption and production patterns, reducing global food waste and chemical management hazards." },
    { keywords: ["climate", "warming", "carbon", "emissions", "weather", "goal 13"], response: "🌱 SDG Goal 13: Climate Action. Take urgent action to combat climate change and its impacts by strengthening resilience to natural disasters." },
    { keywords: ["ocean", "sea", "fish", "marine", "underwater", "goal 14"], response: "🌊 SDG Goal 14: Life Below Water. Conserve and sustainably use the oceans, seas, and marine resources for sustainable development." },
    { keywords: ["land", "forest", "tree", "biodiversity", "animals", "soil", "goal 15"], response: "🌳 SDG Goal 15: Life on Land. Protect, restore, and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt biodiversity loss." },
    { keywords: ["peace", "justice", "institutions", "law", "corruption", "violence", "goal 16"], response: "🕊️ SDG Goal 16: Peace, Justice, and Strong Institutions. Promote peaceful and inclusive societies, provide access to justice for all, and build effective, accountable institutions." },
    { keywords: ["partnership", "cooperation", "global goals", "alliance", "together", "goal 17"], response: "🤝 SDG Goal 17: Partnerships for the Goals. Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development." }
];

// 1. Handling the SDG Finder Form Submissions
document.getElementById('sdg-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const promptInput = document.getElementById('sdg-prompt');
    const userQuery = promptInput.value.toLowerCase();
    
    const responseCard = document.getElementById('ai-response-card');
    const responseText = document.getElementById('ai-text');
    
    let answerFound = false;
    
    for (let item of sdgDatabase) {
        // If the user's query contains any of our target keywords
        if (item.keywords.some(keyword => userQuery.includes(keyword))) {
            responseText.innerText = item.response;
            answerFound = true;
            break;
        }
    }
    
    // Default fallback response if no match is tracked
    if (!answerFound) {
        responseText.innerText = `🔍 I recognized your query, but couldn't find a direct match. Try typing keywords related to global challenges, such as 'poverty', 'energy', 'cities', 'forest', 'peace', or specific markers like 'goal 12'.`;
    }
    
    // Reveal the response block seamlessly
    responseCard.classList.remove('hidden');
});

// 2. Handling the Contact Us Form
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    
    alert(`Thank you, ${name}! Your request for more information on the SDGs has been submitted. Our team will reach out via email shortly.`);
    
    // Reset form fields
    this.reset();
});