'use client';
import { toast } from '@/components/Home/ui/toast/Toast';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setEmailVerified(false);
      setEmailError('');
    }
  };

  const verifyEmail = async () => {
    const email = formData.email;
    if (!email) return;

    setVerifyingEmail(true);
    setEmailError('');

    try {
      const res = await fetch('/api/checkmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.exists) {
        setEmailVerified(true);
        toast.success('Email verified!');
      } else {
        setEmailError('Email not found in our system.');
        setEmailVerified(false);
      }
    } catch (err) {
      console.error('Error verifying email:', err);
      setEmailError('Server error. Please try again.');
      setEmailVerified(false);
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerified) {
      toast.error('Please verify your email first.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Message successfully submitted!');
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(true);
        setEmailVerified(false);
        setTimeout(() => setSubmitted(false), 30000);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (err) {
      toast.error('Error while submitting the form.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="overflow-hidden px-4 md:px-20 lg:px-28 p-8">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mb-12 rounded-xs bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Need Help? Open a Ticket
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Enter your email to verify your identity before submitting a support request.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  {!emailVerified && (
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label htmlFor="email" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                          Your Email
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="flex-grow border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-hidden focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={verifyEmail}
                            disabled={verifyingEmail || !formData.email}
                            className="inline-flex items-center rounded-xs bg-primary px-5 py-3 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {verifyingEmail ? 'Checking...' : 'Check Email'}
                          </button>
                        </div>
                        {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
                      </div>
                    </div>
                  )}

                  {emailVerified && (
                    <>
                      <div className="w-full px-4 md:w-1/2">
                        <div className="mb-8">
                          <label htmlFor="name" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                            Your Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="border-stroke w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-hidden focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="w-full px-4">
                        <div className="mb-8">
                          <label htmlFor="message" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                            Your Message
                          </label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Enter your Message"
                            className="border-stroke w-full resize-none rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-hidden focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                            required
                          ></textarea>
                        </div>
                      </div>

                      <div className="w-full px-4">
                        <button
                          type="submit"
                          className="flex items-center justify-center rounded-xs bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark disabled:cursor-not-allowed disabled:opacity-70"
                          disabled={loading || submitted}
                        >
                          {loading ? (
                            <span className="flex space-x-1">
                              <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></span>
                              <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></span>
                              <span className="h-2 w-2 animate-bounce rounded-full bg-white"></span>
                            </span>
                          ) : submitted ? (
                            'Submitted (try again after 30 secs)'
                          ) : (
                            'Submit Ticket'
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
