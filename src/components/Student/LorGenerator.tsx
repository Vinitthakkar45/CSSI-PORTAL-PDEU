'use client';
import React, { useEffect, useState } from 'react';
import { Document, Page, Text, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import Button from '@/components/Home/ui/button/Button';
import ComponentCard from '@/components/Home/common/ComponentCard';
// import { toast } from 'sonner';

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

        // Try to get from localStorage first
        const localStorageKey = `lorData_${userId}`;
        const storedData = localStorage.getItem(localStorageKey);

        if (storedData) {
          const { name, branch } = JSON.parse(storedData);
          setName(name);
          setBranch(branch);
          setIsLoading(false);
          return;
        }

        // If not in localStorage, fetch from API
        const response = await fetch(`/api/user/getUserById/?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data for LOR');
        }

        const student = await response.json();
        if (student?.profileData) {
          setName(student.profileData.name);
          setBranch(student.profileData.department);

          // Save to localStorage
          localStorage.setItem(
            localStorageKey,
            JSON.stringify({ name: student.profileData.name, branch: student.profileData.department })
          );
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

      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}_lor.pdf`;
      link.click();

      URL.revokeObjectURL(url);

      // toast.success("LOR generated successfully");
    } catch (error) {
      console.error('Error generating PDF:', error);
      // toast.error("Failed to generate LOR");
    }
  };

  return (
    <ComponentCard title="Letter of Recommendation">
      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-pulse">Loading LOR data...</div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className=" p-4 rounded-lg ">
            <h3 className="font-medium text-blue-800 mb-2">LOR Information</h3>
            <p className="text-sm text-blue-700 mb-1">Student Name: {name}</p>
            <p className="text-sm text-blue-700">Department: {branch}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90">
              Download LOR PDF
            </Button>
            <Button onClick={onComplete} variant="outline">
              Continue to Next Step
            </Button>
          </div>
        </div>
      )}
    </ComponentCard>
  );
};

export default LORGenerator;
