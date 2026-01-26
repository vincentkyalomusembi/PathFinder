"""Real-world job scraping service for Kenyan job sites."""
import requests
from bs4 import BeautifulSoup
import re
from typing import List, Dict, Optional
import time
import random
from urllib.parse import urljoin, urlparse

class JobScraper:
    """Scraper for multiple Kenyan job sites."""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def scrape_all_jobs(self, max_jobs: int = 50) -> List[Dict]:
        """Scrape jobs from multiple sources."""
        all_jobs = []
        
        # Scrape from different sources
        sources = [
            self.scrape_brightermonday,
            self.scrape_myjobmag,
            self.scrape_fuzu
        ]
        
        jobs_per_source = max_jobs // len(sources)
        
        for scraper in sources:
            try:
                jobs = scraper(jobs_per_source)
                all_jobs.extend(jobs)
                time.sleep(random.uniform(1, 3))  # Be respectful
            except Exception as e:
                print(f"Error scraping with {scraper.__name__}: {e}")
                continue
        
        return all_jobs[:max_jobs]
    
    def scrape_brightermonday(self, max_jobs: int = 20) -> List[Dict]:
        """Scrape BrighterMonday Kenya jobs."""
        jobs = []
        
        try:
            url = "https://www.brightermonday.co.ke/jobs"
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find job listings
            job_cards = soup.find_all('div', class_='job-item') or soup.find_all('article', class_='job')
            
            for card in job_cards[:max_jobs]:
                try:
                    job = self._extract_brightermonday_job(card)
                    if job:
                        jobs.append(job)
                except Exception as e:
                    continue
                    
        except Exception as e:
            print(f"BrighterMonday scraping error: {e}")
        
        return jobs
    
    def scrape_myjobmag(self, max_jobs: int = 15) -> List[Dict]:
        """Scrape MyJobMag Kenya jobs."""
        jobs = []
        
        try:
            url = "https://www.myjobmag.co.ke/jobs"
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            job_cards = soup.find_all('div', class_='job-list-item') or soup.find_all('div', class_='job-card')
            
            for card in job_cards[:max_jobs]:
                try:
                    job = self._extract_myjobmag_job(card)
                    if job:
                        jobs.append(job)
                except Exception as e:
                    continue
                    
        except Exception as e:
            print(f"MyJobMag scraping error: {e}")
        
        return jobs
    
    def scrape_fuzu(self, max_jobs: int = 15) -> List[Dict]:
        """Scrape Fuzu Kenya jobs."""
        jobs = []
        
        try:
            url = "https://www.fuzu.com/kenya/jobs"
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            job_cards = soup.find_all('div', class_='job-card') or soup.find_all('div', class_='listing-item')
            
            for card in job_cards[:max_jobs]:
                try:
                    job = self._extract_fuzu_job(card)
                    if job:
                        jobs.append(job)
                except Exception as e:
                    continue
                    
        except Exception as e:
            print(f"Fuzu scraping error: {e}")
        
        return jobs
    
    def _extract_brightermonday_job(self, card) -> Optional[Dict]:
        """Extract job data from BrighterMonday card."""
        try:
            title_elem = card.find('h3') or card.find('h2') or card.find('a', class_='job-title')
            title = title_elem.get_text(strip=True) if title_elem else "Unknown Position"
            
            company_elem = card.find('span', class_='company') or card.find('div', class_='company-name')
            company = company_elem.get_text(strip=True) if company_elem else "Unknown Company"
            
            location_elem = card.find('span', class_='location') or card.find('div', class_='job-location')
            location = location_elem.get_text(strip=True) if location_elem else "Kenya"
            
            desc_elem = card.find('p', class_='description') or card.find('div', class_='job-summary')
            description = desc_elem.get_text(strip=True)[:200] if desc_elem else "No description available"
            
            # Extract salary if available
            salary = self._extract_salary(card.get_text())
            
            return {
                "id": hash(f"{title}{company}") % 100000,
                "title": title,
                "company": company,
                "location": location,
                "description": description,
                "salary": salary,
                "category": self._categorize_job(title, description),
                "skills": self._extract_skills(f"{title} {description}"),
                "source": "BrighterMonday"
            }
        except Exception:
            return None
    
    def _extract_myjobmag_job(self, card) -> Optional[Dict]:
        """Extract job data from MyJobMag card."""
        try:
            title_elem = card.find('h4') or card.find('h3') or card.find('a')
            title = title_elem.get_text(strip=True) if title_elem else "Unknown Position"
            
            company_elem = card.find('span', class_='employer') or card.find('div', class_='company')
            company = company_elem.get_text(strip=True) if company_elem else "Unknown Company"
            
            location_elem = card.find('span', class_='location')
            location = location_elem.get_text(strip=True) if location_elem else "Kenya"
            
            desc_elem = card.find('p') or card.find('div', class_='summary')
            description = desc_elem.get_text(strip=True)[:200] if desc_elem else "No description available"
            
            salary = self._extract_salary(card.get_text())
            
            return {
                "id": hash(f"{title}{company}") % 100000,
                "title": title,
                "company": company,
                "location": location,
                "description": description,
                "salary": salary,
                "category": self._categorize_job(title, description),
                "skills": self._extract_skills(f"{title} {description}"),
                "source": "MyJobMag"
            }
        except Exception:
            return None
    
    def _extract_fuzu_job(self, card) -> Optional[Dict]:
        """Extract job data from Fuzu card."""
        try:
            title_elem = card.find('h3') or card.find('h4') or card.find('a')
            title = title_elem.get_text(strip=True) if title_elem else "Unknown Position"
            
            company_elem = card.find('span', class_='company-name') or card.find('div', class_='employer')
            company = company_elem.get_text(strip=True) if company_elem else "Unknown Company"
            
            location_elem = card.find('span', class_='location')
            location = location_elem.get_text(strip=True) if location_elem else "Kenya"
            
            desc_elem = card.find('p', class_='job-description') or card.find('div', class_='description')
            description = desc_elem.get_text(strip=True)[:200] if desc_elem else "No description available"
            
            salary = self._extract_salary(card.get_text())
            
            return {
                "id": hash(f"{title}{company}") % 100000,
                "title": title,
                "company": company,
                "location": location,
                "description": description,
                "salary": salary,
                "category": self._categorize_job(title, description),
                "skills": self._extract_skills(f"{title} {description}"),
                "source": "Fuzu"
            }
        except Exception:
            return None
    
    def _extract_salary(self, text: str) -> Optional[int]:
        """Extract salary from text."""
        # Look for Kenyan salary patterns
        patterns = [
            r'KSh?\s*(\d{1,3}(?:,\d{3})*)',
            r'(\d{1,3}(?:,\d{3})*)\s*KSh?',
            r'(\d{1,3}(?:,\d{3})*)\s*per\s*month',
            r'salary.*?(\d{1,3}(?:,\d{3})*)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    salary_str = match.group(1).replace(',', '')
                    salary = int(salary_str)
                    # Convert to reasonable range (assume monthly if < 50000)
                    if salary < 50000:
                        salary *= 12  # Convert to annual
                    return salary
                except ValueError:
                    continue
        
        return None
    
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
            "logistics": ["logistics", "transport", "driver", "delivery", "supply chain"]
        }
        
        for category, keywords in categories.items():
            if any(keyword in text for keyword in keywords):
                return category
        
        return "other"
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills from job text."""
        text_lower = text.lower()
        
        # Common skills in Kenyan job market
        skills_keywords = [
            "python", "java", "javascript", "php", "sql", "mysql", "excel", "powerpoint",
            "accounting", "quickbooks", "sage", "communication", "leadership", "teamwork",
            "project management", "customer service", "sales", "marketing", "social media",
            "microsoft office", "computer literacy", "data analysis", "reporting",
            "budgeting", "planning", "organization", "problem solving"
        ]
        
        found_skills = []
        for skill in skills_keywords:
            if skill in text_lower:
                found_skills.append(skill.title())
        
        return found_skills[:5]  # Limit to top 5 skills

# Global scraper instance
job_scraper = JobScraper()