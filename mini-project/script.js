// Local Database of responses covering all 17 SDG Goals with Action Steps
const sdgDatabase = [
    { 
        keywords: ["poverty", "poor", "money", "goal 1"], 
        response: "🌍 SDG Goal 1: No Poverty. End poverty in all its forms everywhere by ensuring social protection, equal rights to economic resources, and building resilience.",
        action: "Donate or Volunteer: Support local community resource centers, food banks, economic empowerment programs, or micro-lending platforms that provide structural resources to marginalized groups."
    },
    { 
        keywords: ["hunger", "food", "eat", "agriculture", "nutrition", "goal 2"], 
        response: "🍎 SDG Goal 2: Zero Hunger. End hunger, achieve food security and improved nutrition, and promote sustainable agriculture globally.",
        action: "Reduce Food Waste & Support Local: Plan your meals to minimize waste, and buy produce from local small-holder farmers or community-supported agriculture systems."
    },
    { 
        keywords: ["health", "wellbeing", "disease", "medical", "goal 3"], 
        response: "🏥 SDG Goal 3: Good Health and Well-being. Ensure healthy lives and promote well-being for all individuals at all ages.",
        action: "Prioritize Preventative Health: Stay active, support local health initiatives, and advocate for mental and physical health resource accessibility in your workplace or community."
    },
    { 
        keywords: ["education", "school", "learn", "literacy", "goal 4"], 
        response: "📚 SDG Goal 4: Quality Education. Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.",
        action: "Mentor and Share Skills: Volunteer to tutor youth in your neighborhood, donate books to underfunded libraries, or share open-source educational resources online."
    },
    { 
        keywords: ["gender", "women", "equality", "girls", "sexism", "goal 5"], 
        response: "⚖️ SDG Goal 5: Gender Equality. Achieve gender equality and empower all women and girls by eliminating all forms of discrimination and violence.",
        action: "Promote Equal Opportunity: Actively speak up against unconscious bias, support women-led businesses, and advocate for equal pay and shared domestic responsibilities."
    },
    { 
        keywords: ["water", "sanitation", "clean water", "hygiene", "goal 6"], 
        response: "💧 SDG Goal 6: Clean Water and Sanitation. Ensure availability and sustainable management of safe drinking water and sanitation for all.",
        action: "Conserve Water: Fix leaks immediately, transition to water-efficient appliances, and avoid flushing toxic household chemicals down the drain to keep local waterways safe."
    },
    { 
        keywords: ["energy", "solar", "electricity", "power", "fossil", "goal 7"], 
        response: "⚡ SDG Goal 7: Affordable and Clean Energy. Ensure access to affordable, reliable, sustainable, and modern clean energy alternatives.",
        action: "Optimize Energy Use: Switch to energy-efficient LED lighting, unplug electronics when not in use, and choose renewable energy alternatives or green power options where available."
    },
    { 
        keywords: ["work", "economy", "jobs", "growth", "employment", "goal 8"], 
        response: "💼 SDG Goal 8: Decent Work and Economic Growth. Promote sustained, inclusive, and sustainable economic growth, full and productive employment, and decent work for all.",
        action: "Support Ethical Businesses: Buy from companies that guarantee fair wages, safe working conditions, and transparent supply chains for their employees."
    },
    { 
        keywords: ["industry", "innovation", "infrastructure", "factory", "build", "goal 9"], 
        response: "🏗️ SDG Goal 9: Industry, Innovation, and Infrastructure. Build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation.",
        action: "Foster Digital Inclusion: Support tech-driven local startups, embrace circular design principles, and share technical knowledge or mentorship to help bridge the digital divide."
    },
    { 
        keywords: ["inequality", "discrimination", "reduce gaps", "wealth gap", "goal 10"], 
        response: "📉 SDG Goal 10: Reduced Inequalities. Reduce inequality within and among countries by promoting political, economic, and social inclusion for all.",
        action: "Practice Inclusive Allyship: Support policies and organizations that champion the social, economic, and political inclusion of underrepresented or disadvantaged groups."
    },
    { 
        keywords: ["cities", "communities", "housing", "urban", "transport", "goal 11"], 
        response: "🏙️ SDG Goal 11: Sustainable Cities and Communities. Make cities and human settlements inclusive, safe, resilient, and sustainable.",
        action: "Engage in Urban Green Spaces: Use and advocate for public parks, support local transit systems, and participate in community-driven urban planning projects."
    },
    { 
        keywords: ["consumption", "production", "waste", "recycle", "responsible", "goal 12"], 
        response: "🔄 SDG Goal 12: Responsible Consumption and Production. Ensure sustainable consumption and production patterns, reducing global food waste and chemical management hazards.",
        action: "Practice the 5 R's: Refuse single-use plastics, reduce your purchase of non-recyclable products and choose items with minimal packaging, reuse containers, repurpose old items, and recycle correctly according to local guidelines."
    },
    { 
        keywords: ["climate", "warming", "carbon", "emissions", "weather", "goal 13"], 
        response: "🌱 SDG Goal 13: Climate Action. Take urgent action to combat climate change and its impacts by strengthening resilience to natural disasters.",
        action: "Lower Your Carbon Footprint: Walk, bike, use public transit, or carpool whenever possible, and advocate for climate-conscious policies in your local municipality."
    },
    { 
        keywords: ["ocean", "sea", "fish", "marine", "underwater", "goal 14"], 
        response: "🌊 SDG Goal 14: Life Below Water. Conserve and sustainably use the oceans, seas, and marine resources for sustainable development.",
        action: "Eliminate Plastic Pollution: Participate in beach or river cleanups, and stop using plastic bags, straws, and single-use water bottles that end up in marine ecosystems."
    },
    { 
        keywords: ["land", "forest", "tree", "biodiversity", "animals", "soil", "goal 15"], 
        response: "🌳 SDG Goal 15: Life on Land. Protect, restore, and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt biodiversity loss.",
        action: "Protect Local Ecosystems: Plant native trees or a pollinator-friendly garden, avoid indiscriminate use of chemical pesticides, and only buy certified sustainably-sourced wood and paper products."
    },
    { 
        keywords: ["peace", "justice", "institutions", "law", "corruption", "violence", "goal 16"], 
        response: "🕊️ SDG Goal 16: Peace, Justice, and Strong Institutions. Promote peaceful and inclusive societies, provide access to justice for all, and build effective, accountable institutions.",
        action: "Be an Active Citizen: Exercise your right to vote, fight corruption by demanding institutional transparency, and foster an environment of peace and dialogue in your spaces."
    },
    { 
        keywords: ["partnership", "cooperation", "global goals", "alliance", "together", "goal 17"], 
        response: "🤝 SDG Goal 17: Partnerships for the Goals. Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development.",
        action: "Build Collaborative Alliances: Connect with community groups, NGOs, or cross-sector networks to pool resources and tackle local sustainable development challenges together."
    }
];

// ==========================================================================
// 1. Handling the SDG Finder Form Submissions
// ==========================================================================
document.getElementById('sdg-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const promptInput = document.getElementById('sdg-prompt');
    const userQuery = promptInput.value.toLowerCase().trim();
    
    const responseCard = document.getElementById('ai-response-card');
    const responseText = document.getElementById('ai-text');
    
    let answerFound = false;
    
    for (let item of sdgDatabase) {
        // Evaluate keywords safely
        const isMatch = item.keywords.some(keyword => {
            if (keyword.startsWith("goal ")) {
                const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                return regex.test(userQuery);
            }
            return userQuery.includes(keyword);
        });

        if (isMatch) {
            // Injects formatted HTML layout with the new action-box
            responseText.innerHTML = `
                <p class="response-main-text">${item.response}</p>
                <div class="action-box">
                    <strong>💡 Action Step:</strong> ${item.action}
                </div>
            `;
            answerFound = true;
            break;
        }
    }
    
    // Default fallback response if no match is tracked
    if (!answerFound) {
        responseText.innerHTML = `<p>🔍 I recognized your query, but couldn't find a direct match. Try typing keywords related to global challenges, such as 'poverty', 'energy', 'cities', 'forest', 'peace', or specific markers like 'goal 12'.</p>`;
    }
    
    // Reveal the response block seamlessly
    responseCard.classList.remove('hidden');
});

// ==========================================================================
// 2. Interactive Contact Form Toggle & Submission Handler
// ==========================================================================
const toggleMessageBtn = document.getElementById('toggle-message-btn');
const formFieldsWrapper = document.getElementById('form-fields');
const contactForm = document.getElementById('contact-form');

// Click listener to handle hiding/showing the form when "Leave a Message" is selected
toggleMessageBtn.addEventListener('click', function() {
    if (formFieldsWrapper.classList.contains('hidden')) {
        // Reveal the nested form inputs
        formFieldsWrapper.classList.remove('hidden');
        // Update button UI to allow closing
        toggleMessageBtn.innerHTML = `<i class="fa-solid fa-angle-up"></i> Close Form`;
    } else {
        // Hide the input cluster again
        formFieldsWrapper.classList.add('hidden');
        toggleMessageBtn.innerHTML = `<i class="fa-solid fa-envelope"></i> Leave a Message`;
    }
});

// Form processing configuration
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    
    alert(`Thank you, ${name}! Your request for more information on the SDGs has been submitted. Our team will reach out via email shortly.`);
    
    // Clear data from input elements
    this.reset();
    
    // Re-hide the input module section until requested again
    formFieldsWrapper.classList.add('hidden');
    toggleMessageBtn.innerHTML = `<i class="fa-solid fa-envelope"></i> Leave a Message`;
});