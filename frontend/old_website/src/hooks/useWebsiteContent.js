import { useState, useEffect } from 'react';
import { api } from '../lib/api';

/**
 * Hook to fetch and manage website content from the CMS
 */
export function useWebsiteContent() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/website-content', { requiresAuth: false });
      
      if (!response.ok) {
        throw new Error('Failed to fetch website content');
      }

      const data = await response.json();
      
      // Group content by section for easy access
      const groupedContent = data.reduce((acc, item) => {
        if (!acc[item.section]) {
          acc[item.section] = {};
        }
        acc[item.section][item.key] = item.value;
        return acc;
      }, {});

      setContent(groupedContent);
    } catch (err) {
      console.error('Error fetching website content:', err);
      setError(err.message);
      // Set default content as fallback
      setContent(getDefaultContent());
    } finally {
      setLoading(false);
    }
  };

  return { content, loading, error, refetch: fetchContent };
}

/**
 * Default/fallback content if API fails
 */
function getDefaultContent() {
  return {
    HERO: {
      title: 'Play. Learn. Taste. Grow.',
      subtitle: 'Taste & Grow helps schools turn real food into learning and fundraising — with students leading their own school e-market and families ordering online.',
      tagline: 'Built for schools. Inspired by nature.',
    },
    HOW_IT_WORKS: {
      title: 'How It Works',
      step_1_title: 'Teacher Registers',
      step_1_desc: 'Have your class take the lead. Choose one of the three food kits and pick your preferred date.',
      step_2_title: 'Parents Buy Online',
      step_2_desc: 'Families order easily through a QR code. We deliver everything directly to the school, ready for the big day.',
      step_3_title: 'Students Lead the Market',
      step_3_desc: "Students pack, present, and share what they've learned — turning their classroom into a mini market stand.",
      step_4_title: 'School Grows',
      step_4_desc: 'Each order raises funds and builds community through real, hands-on learning.',
    },
    FOOD_KIT: {
      section_title: 'Real Superfoods. Real Learning. Real Impact.',
      section_subtitle: "Each Superfood Kit connects classrooms to powerful foods, inspiring students to explore their origins, taste their benefits, and share their story. It's time to Play, Learn, Taste, and Grow!",
    },
    FOOTER: {
      company_name: 'Taste & Grow',
      tagline: 'Built for schools. Inspired by nature.',
      email: 'hello@tasteandgrow.com',
      copyright: '© 2025 Taste & Grow. All rights reserved.',
    },
  };
}

