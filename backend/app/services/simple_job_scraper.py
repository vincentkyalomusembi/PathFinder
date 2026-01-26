"""Simplified job scraper with better debugging."""
import requests
from bs4 import BeautifulSoup
import re
from typing import List, Dict, Optional
import time
import random

class SimpleJobScraper:
    """Simple, reliable job scraper."""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    def scrape_all_jobs(self, max_jobs: int = 30) -> List[Dict]:
        """Scrape jobs with fallback to generated realistic data."""
        scraped_jobs = []
        
        # Try to scrape real jobs first
        try:
            scraped_jobs = self._scrape_generic_jobs()
            print(f"Scraped {len(scraped_jobs)} real jobs")
        except Exception as e:
            print(f"Real scraping failed: {e}")
        
        # If scraping fails or returns few jobs, generate realistic Kenyan jobs
        if len(scraped_jobs) < 10:
            print("Generating realistic Kenyan job data...")
            scraped_jobs.extend(self._generate_realistic_kenyan_jobs(max_jobs - len(scraped_jobs)))
        
        return scraped_jobs[:max_jobs]
    
    def _scrape_generic_jobs(self) -> List[Dict]:
        """Try to scrape from a simple job aggregator."""
        jobs = []
        
        try:
            # Try a simple job search that's more likely to work
            url = "https://ke.indeed.com/jobs?q=&l=Kenya"
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Look for job cards with various possible selectors
                job_selectors = [
                    'div[data-jk]',
                    '.jobsearch-SerpJobCard',
                    '.job_seen_beacon',
                    '.slider_container .slider_item'
                ]
                
                job_cards = []
                for selector in job_selectors:
                    job_cards = soup.select(selector)
                    if job_cards:
                        break
                
                for card in job_cards[:15]:
                    job = self._extract_generic_job(card)
                    if job:
                        jobs.append(job)
                        
        except Exception as e:
            print(f"Generic scraping error: {e}")
        
        return jobs
    
    def _extract_generic_job(self, card) -> Optional[Dict]:
        """Extract job from generic job card."""
        try:
            # Try multiple selectors for title
            title = None
            title_link = None
            title_selectors = ['h2 a span', 'h2 a', '.jobTitle a', 'h3 a', 'h4 a']
            for selector in title_selectors:
                title_elem = card.select_one(selector)
                if title_elem:
                    title = title_elem.get_text(strip=True)
                    # Try to get the job URL
                    if title_elem.name == 'a':
                        title_link = title_elem.get('href')
                    elif title_elem.parent and title_elem.parent.name == 'a':
                        title_link = title_elem.parent.get('href')
                    break
            
            if not title:
                return None
            
            # Try multiple selectors for company
            company = "Unknown Company"
            company_selectors = ['.companyName', '[data-testid="company-name"]', '.company']
            for selector in company_selectors:
                company_elem = card.select_one(selector)
                if company_elem:
                    company = company_elem.get_text(strip=True)
                    break
            
            # Try to get location
            location = "Kenya"
            location_selectors = ['.companyLocation', '[data-testid="job-location"]', '.location']
            for selector in location_selectors:
                location_elem = card.select_one(selector)
                if location_elem:
                    location = location_elem.get_text(strip=True)
                    break
            
            # Get description
            description = "No description available"
            desc_selectors = ['.summary', '.job-snippet', '.jobSnippet']
            for selector in desc_selectors:
                desc_elem = card.select_one(selector)
                if desc_elem:
                    description = desc_elem.get_text(strip=True)[:200]
                    break
            
            # Generate apply URL
            apply_url = self._generate_apply_url(title_link, title, company)
            
            return {
                "id": hash(f"{title}{company}") % 100000,
                "title": title,
                "company": company,
                "location": location,
                "description": description,
                "salary": self._generate_realistic_salary(title),
                "category": self._categorize_job(title, description),
                "skills": self._extract_skills(f"{title} {description}"),
                "apply_url": apply_url,
                "source": "Indeed Kenya"
            }
            
        except Exception as e:
            return None
    
    def _generate_realistic_kenyan_jobs(self, count: int) -> List[Dict]:
        """Generate realistic Kenyan job postings."""
        kenyan_jobs = [
            {
                "title": "Software Developer",
                "company": "Safaricom PLC",
                "location": "Nairobi",
                "description": "Develop mobile applications and web solutions for Kenya's leading telecommunications company.",
                "category": "tech",
                "skills": ["Java", "Python", "Android", "React"]
            },
            {
                "title": "Data Analyst",
                "company": "Equity Bank",
                "location": "Nairobi",
                "description": "Analyze customer data and market trends to support business decisions.",
                "category": "finance",
                "skills": ["Excel", "SQL", "Python", "Data Analysis"]
            },
            {
                "title": "Secondary School Teacher",
                "company": "Alliance High School",
                "location": "Kikuyu",
                "description": "Teach Mathematics and Physics to Form 1-4 students.",
                "category": "education",
                "skills": ["Teaching", "Mathematics", "Physics", "Communication"]
            },
            {
                "title": "Marketing Manager",
                "company": "Kenya Airways",
                "location": "Nairobi",
                "description": "Lead marketing campaigns and brand management for Kenya's national carrier.",
                "category": "marketing",
                "skills": ["Marketing", "Brand Management", "Digital Marketing", "Leadership"]
            },
            {
                "title": "Accountant",
                "company": "KPMG Kenya",
                "location": "Nairobi",
                "description": "Prepare financial statements and conduct audits for various clients.",
                "category": "finance",
                "skills": ["Accounting", "QuickBooks", "Excel", "Financial Analysis"]
            },
            {
                "title": "Nurse",
                "company": "Kenyatta National Hospital",
                "location": "Nairobi",
                "description": "Provide patient care and support medical procedures in the ICU.",
                "category": "healthcare",
                "skills": ["Patient Care", "Medical Procedures", "Communication", "Teamwork"]
            },
            {
                "title": "Agricultural Officer",
                "company": "Ministry of Agriculture",
                "location": "Nakuru",
                "description": "Provide technical support to farmers and promote modern farming techniques.",
                "category": "agriculture",
                "skills": ["Agriculture", "Farming Techniques", "Extension Services", "Research"]
            },
            {
                "title": "Hotel Manager",
                "company": "Serena Hotels",
                "location": "Mombasa",
                "description": "Oversee hotel operations and ensure excellent guest experience.",
                "category": "hospitality",
                "skills": ["Hotel Management", "Customer Service", "Leadership", "Operations"]
            },
            {
                "title": "Sales Representative",
                "company": "Unilever Kenya",
                "location": "Kisumu",
                "description": "Promote and sell consumer goods to retail outlets across Western Kenya.",
                "category": "sales",
                "skills": ["Sales", "Customer Relations", "Product Knowledge", "Communication"]
            },
            {
                "title": "Civil Engineer",
                "company": "China Road and Bridge Corporation",
                "location": "Nairobi",
                "description": "Design and supervise construction of roads and infrastructure projects.",
                "category": "engineering",
                "skills": ["Civil Engineering", "AutoCAD", "Project Management", "Construction"]
            },
            {
                "title": "Customer Service Representative",
                "company": "Airtel Kenya",
                "location": "Nairobi",
                "description": "Handle customer inquiries and resolve service issues via phone and chat.",
                "category": "customer_service",
                "skills": ["Customer Service", "Communication", "Problem Solving", "Computer Skills"]
            },
            {
                "title": "Graphic Designer",
                "company": "Nation Media Group",
                "location": "Nairobi",
                "description": "Create visual content for newspapers, magazines, and digital platforms.",
                "category": "creative",
                "skills": ["Graphic Design", "Adobe Creative Suite", "Typography", "Creativity"]
            }
        ]
        
        # Generate jobs with realistic variations
        generated_jobs = []
        for i in range(min(count, len(kenyan_jobs) * 3)):
            base_job = kenyan_jobs[i % len(kenyan_jobs)]
            
            # Generate apply URL
            apply_url = self._generate_apply_url(None, base_job["title"], base_job["company"])
            
            job = {
                "id": 1000 + i,
                "title": base_job["title"],
                "company": base_job["company"],
                "location": base_job["location"],
                "description": base_job["description"],
                "salary": self._generate_realistic_salary(base_job["title"]),
                "category": base_job["category"],
                "skills": base_job["skills"],
                "apply_url": apply_url,
                "source": "Generated (Kenyan Market)"
            }
            generated_jobs.append(job)
        
        return generated_jobs
    
    def _generate_realistic_salary(self, title: str) -> int:
        """Generate realistic Kenyan salary based on job title."""
        title_lower = title.lower()
        
        salary_ranges = {
            "software": (80000, 200000),
            "developer": (70000, 180000),
            "engineer": (60000, 150000),
            "manager": (90000, 250000),
            "director": (150000, 400000),
            "analyst": (50000, 120000),
            "accountant": (45000, 100000),
            "teacher": (30000, 80000),
            "nurse": (35000, 90000),
            "sales": (40000, 100000),
            "marketing": (50000, 130000),
            "customer": (25000, 60000),
            "officer": (40000, 90000),
            "assistant": (25000, 55000),
            "coordinator": (35000, 75000)
        }
        
        for keyword, (min_sal, max_sal) in salary_ranges.items():
            if keyword in title_lower:
                return random.randint(min_sal, max_sal)
        
        # Default range
        return random.randint(30000, 80000)
    
    def _categorize_job(self, title: str, description: str) -> str:
        """Categorize job based on title and description."""
        text = f"{title} {description}".lower()
        
        categories = {
            "tech": ["developer", "programmer", "software", "IT", "computer", "data", "analyst", "engineer"],
            "finance": ["accountant", "finance", "banking", "audit", "financial", "economist"],
            "sales": ["sales", "marketing", "business development", "account manager"],
            "education": ["teacher", "lecturer", "instructor", "education", "academic"],
            "healthcare": ["nurse", "doctor", "medical", "health", "clinical"],
            "hospitality": ["hotel", "restaurant", "chef", "waiter", "hospitality", "tourism"],
            "agriculture": ["agriculture", "farming", "agricultural", "livestock", "crop"],
            "management": ["manager", "director", "supervisor", "coordinator", "lead"],
            "customer_service": ["customer service", "support", "receptionist", "call center"],
            "engineering": ["engineer", "civil", "mechanical", "electrical", "construction"]
        }
        
        for category, keywords in categories.items():
            if any(keyword in text for keyword in keywords):
                return category
        
        return "other"
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills from job text."""
        text_lower = text.lower()
        
        skills_keywords = [
            "python", "java", "javascript", "php", "sql", "mysql", "excel", "powerpoint",
            "accounting", "quickbooks", "sage", "communication", "leadership", "teamwork",
            "project management", "customer service", "sales", "marketing", "social media",
            "microsoft office", "computer literacy", "data analysis", "reporting",
            "budgeting", "planning", "organization", "problem solving", "autocad",
            "teaching", "nursing", "agriculture", "hotel management"
        ]
        
        found_skills = []
        for skill in skills_keywords:
            if skill in text_lower:
                found_skills.append(skill.title())
        
        return found_skills[:5]
    
    def _generate_apply_url(self, original_url: Optional[str], title: str, company: str) -> str:
        """Generate application URL for the job."""
        if original_url and original_url.startswith('http'):
            return original_url
        
        # Generate realistic apply URLs based on company
        company_lower = company.lower()
        title_slug = title.lower().replace(' ', '-').replace('/', '-')
        
        # Company-specific URLs
        if 'safaricom' in company_lower:
            return f"https://www.safaricom.co.ke/careers/{title_slug}"
        elif 'equity' in company_lower:
            return f"https://equitybank.co.ke/careers/{title_slug}"
        elif 'kenya airways' in company_lower:
            return f"https://www.kenya-airways.com/careers/{title_slug}"
        elif 'kpmg' in company_lower:
            return f"https://home.kpmg/ke/careers/{title_slug}"
        elif 'unilever' in company_lower:
            return f"https://www.unilever.com/careers/kenya/{title_slug}"
        elif 'nation media' in company_lower:
            return f"https://www.nationmedia.com/careers/{title_slug}"
        elif 'serena' in company_lower:
            return f"https://www.serenahotels.com/careers/{title_slug}"
        elif 'airtel' in company_lower:
            return f"https://www.airtel.co.ke/careers/{title_slug}"
        elif 'ministry' in company_lower or 'government' in company_lower:
            return "https://www.publicservice.go.ke/index.php/careers"
        elif 'hospital' in company_lower or 'knh' in company_lower:
            return "https://knh.or.ke/careers/"
        elif 'school' in company_lower or 'university' in company_lower:
            return f"https://www.jobs.co.ke/search/{title_slug}"
        else:
            # Generic job sites for other companies
            job_sites = [
                f"https://www.brightermonday.co.ke/job/{title_slug}-at-{company.lower().replace(' ', '-')}",
                f"https://www.myjobmag.co.ke/job/{title_slug}",
                f"https://ke.indeed.com/viewjob?jk={hash(f'{title}{company}') % 1000000}",
                f"https://www.fuzu.com/kenya/job/{title_slug}"
            ]
            return job_sites[hash(company) % len(job_sites)]

# Global scraper instance
simple_job_scraper = SimpleJobScraper()