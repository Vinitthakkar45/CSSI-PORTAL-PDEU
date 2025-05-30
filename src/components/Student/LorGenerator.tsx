'use client';
import React, { useEffect, useState } from 'react';
import { Document, Page, Text, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import Button from '@/components/Home/ui/button/Button';
import ComponentCard from '@/components/Home/common/ComponentCard';
import { Download } from 'lucide-react';

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
  },
  date: {
    textAlign: 'right',
    padding: 30,
  },
  heading: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },

  body: {
    textAlign: 'justify',
    marginLeft: 50,
    lineHeight: 1.5,
    marginRight: 50,
    marginBottom: 15,
  },
  footer: {
    marginRight: 40,
  },
});

const MyPDF = ({ name, branch }: { name: string; branch: string }) => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src="/topLogo.png" />
        <Text style={styles.date}>Date : April 1, {year}</Text>
        <Text style={styles.heading}> Letter of Recommendation</Text>
        <Text style={styles.body}>
          School of Technology, Pandit Deendayal Energy University, takes this opportunity to write a recommendation for{' '}
          <Text style={{ fontWeight: 'bold' }}>{name}</Text>, who is a student of B.Tech/B.Sc. Sem-II in{' '}
          <Text style={{ fontWeight: 'bold' }}>{branch}</Text>. As a part of the curriculum, every student enrolled at
          B.Tech/B.Sc. program has to undergo a Civic & Social Service Internship (CSSI) after B.Tech/B.Sc. first year
          during summer vacation (May – July, 2025). CSSI internship is a mandatory internship. Engaging in civic and
          social responsibility is crucial for democracy and dignified living. It upholds democratic values such as
          justice, freedom, equality, diversity, and human rights, ensuring a thriving society.
        </Text>
        <Text style={styles.body}>
          We, therefore, recommend <Text style={{ fontWeight: 'bold' }}>{name}</Text> to your esteemed NGO. In our
          knowledge, the student has the necessary skills and expertise to perform the duties assigned to him/her
          timely. We are confident that the student will apply the same enthusiasm in your institution, thus giving the
          best. The student will follow your organization&#39;s rules and regulations and take care of the logistics
          required to undergo the internship.
        </Text>
        <Text style={styles.body}>Sincerely,</Text>
        <Image src="/footer.png" style={styles.footer} />
      </Page>
    </Document>
  );
};

const LORGenerator = ({ onComplete, userId }: { onComplete: () => void; userId: string }) => {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);

        const localStorageKey = `userData`;
        const storedData = localStorage.getItem(localStorageKey);

        if (storedData) {
          const userData = JSON.parse(storedData);
          if (userData?.profileData) {
            setName(userData.profileData.name);
            setBranch(userData.profileData.department);
            setIsLoading(false);
            return;
          }
        }

        const response = await fetch(`/api/user/getUserById/?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data for LOR');
        }

        const student = await response.json();
        if (student?.profileData) {
          setName(student.profileData.name);
          setBranch(student.profileData.department);

          localStorage.setItem(localStorageKey, JSON.stringify(student));
        }
      } catch (err) {
        console.error('Error fetching LOR data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchDetails();
    }
  }, [userId]);

  const handleDownload = async () => {
    try {
      const blob = await pdf(<MyPDF name={name} branch={branch} />).toBlob();
      const url = URL.createObjectURL(blob);

      // Create an invisible iframe to detect when download dialog closes
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}_LOR.pdf`;

      // Track download completion
      let dialogClosed = false;

      // Create a promise that resolves when download dialog closes
      const downloadPromise = new Promise((resolve) => {
        // Monitor focus to detect when download dialog closes
        const handleFocus = () => {
          if (!dialogClosed) {
            dialogClosed = true;
            window.removeEventListener('focus', handleFocus);
            document.body.removeChild(iframe);
            URL.revokeObjectURL(url);
            resolve(true);
          }
        };

        window.addEventListener('focus', handleFocus);

        // Fallback if focus event doesn't fire
        setTimeout(() => {
          if (!dialogClosed) {
            window.removeEventListener('focus', handleFocus);
            document.body.removeChild(iframe);
            URL.revokeObjectURL(url);
            resolve(false);
          }
        }, 5000); // 5 second timeout fallback
      });

      // Trigger download
      link.click();

      // Wait for download dialog to close
      const completed = await downloadPromise;
      if (completed) {
        onComplete();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <ComponentCard title="Get Your Letter of Recommendation">
      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-pulse">Loading LOR data...</div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90" startIcon={<Download />}>
            Download LOR PDF
          </Button>
        </div>
      )}
    </ComponentCard>
  );
};

export default LORGenerator;
