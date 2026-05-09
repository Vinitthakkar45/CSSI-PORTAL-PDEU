// Letter of Recommendation Templates
// Add a new template entry each year without modifying the component

export interface LORTemplate {
  year: number;
  date: string;
  headerText: string;
  paragraphs: string[];
  signature: {
    signatureName?: string;
    position: string;
    organization: string;
    address: string;
  };
  footerText?: string;
}

export const lorTemplates: Record<number, LORTemplate> = {
  2026: {
    year: 2026,
    date: 'May 5, 2026',
    headerText: 'Letter of Recommendation',
    paragraphs: [
      'School of Technology, Pandit Deendayal Energy University, takes this opportunity to write a recommendation for {{name}} ({{rollNo}}), who is a student of B.Tech. Sem-II in {{branch}}. As a part of the curriculum, every student enrolled at B.Tech. program has to undergo a Civic & Social Service Internship (CSSI) after B.Tech. first year during summer vacation (May – July, 2026). CSSI internship is a mandatory internship. Engaging in civic and social responsibility is crucial for democracy and dignified living. It upholds democratic values such as justice, freedom, equality, diversity, and human rights, ensuring a thriving society.',
      'We, therefore, recommend {{name}} ({{rollNo}}) to your esteemed Organization. In our knowledge, the student has the necessary skills and expertise to perform the duties assigned to him/her timely. We are confident that the student will apply the same enthusiasm in your institution, thus giving the best. The student will follow your organization\'s rules and regulations and take care of the logistics required to undergo the internship.',
    ],
    signature: {
      position: 'Director',
      organization: 'School of Technology',
      address: 'Pandit Deendayal Energy University, Gandhinagar, Gujarat, India',
    },
  },
  2025: {
    year: 2025,
    date: 'April 1, 2025',
    headerText: 'Letter of Recommendation',
    paragraphs: [
      'School of Technology, Pandit Deendayal Energy University, takes this opportunity to write a recommendation for {{name}}, who is a student of B.Tech/B.Sc. Sem-II in {{branch}}. As a part of the curriculum, every student enrolled at B.Tech/B.Sc. program has to undergo a Civic & Social Service Internship (CSSI) after B.Tech/B.Sc. first year during summer vacation (May – July, 2025). CSSI internship is a mandatory internship. Engaging in civic and social responsibility is crucial for democracy and dignified living. It upholds democratic values such as justice, freedom, equality, diversity, and human rights, ensuring a thriving society.',
      'We, therefore, recommend {{name}} to your esteemed NGO. In our knowledge, the student has the necessary skills and expertise to perform the duties assigned to him/her timely. We are confident that the student will apply the same enthusiasm in your institution, thus giving the best. The student will follow your organization\'s rules and regulations and take care of the logistics required to undergo the internship.',
    ],
    signature: {
      position: 'Director',
      organization: 'School of Technology',
      address: 'Pandit Deendayal Energy University, Gandhinagar, Gujarat, India',
    },
  },
};

export const getCurrentYearTemplate = (): LORTemplate => {
  const currentYear = new Date().getFullYear();
  return lorTemplates[currentYear] || lorTemplates[Math.max(...Object.keys(lorTemplates).map(Number))];
};

export const replacePlaceholders = (
  text: string,
  data: {
    name: string;
    rollNo?: string;
    branch: string;
  }
): string => {
  return text
    .replace(/{{name}}/g, data.name)
    .replace(/{{rollNo}}/g, data.rollNo || '')
    .replace(/{{branch}}/g, data.branch);
};
