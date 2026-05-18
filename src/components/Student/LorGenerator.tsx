'use client';
import React, { useEffect, useState } from 'react';
import { Document, Page, Text, StyleSheet, pdf, Image, View } from '@react-pdf/renderer'; // View used in signature section
import Button from '@/components/Home/ui/button/Button';
import ComponentCard from '@/components/Home/common/ComponentCard';
import { Download } from 'lucide-react';
import { getCurrentYearTemplate, replacePlaceholders, LORTemplate } from '@/config/lorTemplates';

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
  },
  headerImage: {
    width: '100%',
    height: 'auto',
    marginBottom: 10,
  },
  dateTop: {
    textAlign: 'right',
    paddingRight: 40,
    paddingTop: 15,
    paddingBottom: 10,
    fontSize: 11,
  },
  heading: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 5,
  },
  body: {
    textAlign: 'justify',
    marginLeft: 40,
    lineHeight: 1.6,
    marginRight: 40,
    marginBottom: 12,
    fontSize: 11,
  },
  signatureSection: {
    marginLeft: 40,
    marginRight: 40,
    marginTop: 20,
    marginBottom: 15,
  },
  footerImage: {
    width: '100%',
    height: 'auto',
  },
  signatureText: {
    fontSize: 11,
    marginBottom: 3,
  },
});

interface PDFProps {
  name: string;
  branch: string;
  rollNo?: string;
  template: LORTemplate;
}

const MyPDF = ({ name, branch, rollNo, template }: PDFProps) => {
  const processedParagraphs = template.paragraphs.map((para) =>
    replacePlaceholders(para, { name, rollNo: rollNo || '', branch })
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Image */}
        <Image src="/topLogo.png" style={styles.headerImage} />

        {/* Date */}
        <Text style={styles.dateTop}>Date: {template.date}</Text>

        {/* Heading */}
        <Text style={styles.heading}>{template.headerText}</Text>

        {/* Body Paragraphs */}
        {processedParagraphs.map((paragraph, index) => (
          <Text key={index} style={styles.body}>
            {paragraph}
          </Text>
        ))}

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Image src="/footer.png" style={styles.footerImage} />
        </View>
      </Page>
    </Document>
  );
};

const LORGenerator = ({ onComplete, userId }: { onComplete: () => void; userId: string }) => {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [template, setTemplate] = useState<LORTemplate>(getCurrentYearTemplate());

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        setTemplate(getCurrentYearTemplate());

        const localStorageKey = `userData`;
        const storedData = localStorage.getItem(localStorageKey);

        if (storedData) {
          const userData = JSON.parse(storedData);
          if (userData?.profileData) {
            setName(userData.profileData.name);
            setBranch(userData.profileData.department);
            setRollNo(userData.profileData.rollNumber || '');
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
          setRollNo(student.profileData.rollNumber || '');

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
      const blob = await pdf(<MyPDF name={name} branch={branch} rollNo={rollNo} template={template} />).toBlob();
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
