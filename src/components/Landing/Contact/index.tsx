'use client';
import { toast } from '@/components/Home/ui/toast/Toast';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [otpData, setOtpData] = useState({
    otp: '',
    sent: false,
    verified: false,
  });

  const [loading, setLoading] = useState({
    sendingOtp: false,
    verifyingOtp: false,
    submitting: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'otp') {
      setOtpData((prev) => ({ ...prev, otp: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Reset OTP state when email changes
      if (name === 'email') {
        setOtpData({
          otp: '',
          sent: false,
          verified: false,
        });
        setOtpTimer(0);
      }
    }
  };

  const startTimer = () => {
    setOtpTimer(300); // 5 minutes
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    const email = formData.email;
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }

    setLoading((prev) => ({ ...prev, sendingOtp: true }));

    try {
      const res = await fetch('/api/OTP/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpData((prev) => ({ ...prev, sent: true }));
        toast.success('OTP sent to your email!');
        startTimer();
      } else {
        toast.error(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      toast.error('Server error. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, sendingOtp: false }));
    }
  };

  const verifyOtp = async () => {
    const { email } = formData;
    const { otp } = otpData;

    if (!otp) {
      toast.error('Please enter the OTP.');
      return;
    }

    setLoading((prev) => ({ ...prev, verifyingOtp: true }));

    try {
      const res = await fetch('/api/OTP/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpData((prev) => ({ ...prev, verified: true }));
        toast.success('Email verified successfully!');
        setOtpTimer(0);
      } else {
        toast.error(data.error || 'Invalid OTP.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      toast.error('Server error. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, verifyingOtp: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpData.verified) {
      toast.error('Please verify your email with OTP first.');
      return;
    }

    setLoading((prev) => ({ ...prev, submitting: true }));

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Support ticket submitted successfully!');
        setFormData({ name: '', email: '', message: '' });
        setOtpData({ otp: '', sent: false, verified: false });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 30000);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (err) {
      toast.error('Error while submitting the form.');
      console.log(err);
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="contact" className="overflow-hidden px-4 sm:px-6 md:px-20 lg:px-28 py-6 sm:py-8">
      <div className="container max-w-4xl mx-auto">
        <div className="-mx-2 sm:-mx-4 flex flex-wrap">
          <div className="w-full px-2 sm:px-4">
            <div className="mb-8 sm:mb-12 rounded-xs bg-white px-4 sm:px-6 md:px-8 py-8 sm:py-11 shadow-three dark:bg-gray-dark lg:mb-5 lg:px-8 xl:p-[55px]">
              <h2 className="mb-3 text-xl sm:text-2xl font-bold text-black dark:text-white lg:text-2xl xl:text-3xl text-center sm:text-left">
                Need Help? Open a Ticket
              </h2>
              <p className="mb-8 sm:mb-12 text-sm sm:text-base font-medium text-body-color text-center sm:text-left">
                Verify your email with OTP before submitting a support request.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="-mx-2 sm:-mx-4 flex flex-wrap">
                  {/* Email Input Section */}
                  <div className="w-full px-2 sm:px-4">
                    <div className="mb-6 sm:mb-8">
                      <label htmlFor="email" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Your Email *
                      </label>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className="flex-grow border-stroke rounded-xs border bg-[#f8f8f8] px-4 sm:px-6 py-3 text-sm sm:text-base text-body-color outline-hidden focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                          required
                          disabled={otpData.verified}
                        />
                        {!otpData.verified && (
                          <button
                            type="button"
                            onClick={sendOtp}
                            disabled={loading.sendingOtp || !formData.email || (otpData.sent && otpTimer > 0)}
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xs bg-primary px-4 sm:px-5 py-3 text-sm sm:text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark disabled:cursor-not-allowed disabled:opacity-70 whitespace-nowrap"
                          >
                            {loading.sendingOtp ? (
                              <span className="flex items-center space-x-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                <span className="hidden sm:inline">Sending...</span>
                                <span className="sm:hidden">Sending</span>
                              </span>
                            ) : otpData.sent && otpTimer > 0 ? (
                              <span className="text-xs sm:text-sm">Resend ({formatTime(otpTimer)})</span>
                            ) : otpData.sent ? (
                              'Resend OTP'
                            ) : (
                              'Send OTP'
                            )}
                          </button>
                        )}
                        {otpData.verified && (
                          <div className="w-full sm:w-auto inline-flex items-center justify-center rounded-xs bg-green-500 px-4 sm:px-5 py-3 text-sm sm:text-base font-medium text-white">
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Verified
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* OTP Input Section */}
                  {otpData.sent && !otpData.verified && (
                    <div className="w-full px-2 sm:px-4">
                      <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xs border border-blue-200 dark:border-blue-800">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-3 space-y-1 sm:space-y-0">
                          <div className="flex items-center">
                            <svg
                              className="mr-2 h-4 sm:h-5 w-4 sm:w-5 text-blue-500 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                              OTP sent to your email. Check your inbox (and spam folder).
                            </p>
                          </div>
                        </div>

                        <label className="mb-3 block text-sm font-medium text-dark dark:text-white text-center">
                          Enter OTP
                        </label>

                        {/* OTP Input Boxes */}
                        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 px-2">
                          {[0, 1, 2, 3].map((index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength={1}
                              value={otpData.otp[index] || ''}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                const newOtp = otpData.otp.split('');
                                newOtp[index] = value;
                                const updatedOtp = newOtp.join('').slice(0, 4);
                                setOtpData((prev) => ({ ...prev, otp: updatedOtp }));

                                // Auto-focus next input
                                if (value && index < 3) {
                                  const nextInput = document.querySelector(
                                    `input[data-otp-index="${index + 1}"]`
                                  ) as HTMLInputElement;
                                  if (nextInput) nextInput.focus();
                                }
                              }}
                              onKeyDown={(e) => {
                                // Handle backspace
                                if (e.key === 'Backspace' && !otpData.otp[index] && index > 0) {
                                  const prevInput = document.querySelector(
                                    `input[data-otp-index="${index - 1}"]`
                                  ) as HTMLInputElement;
                                  if (prevInput) prevInput.focus();
                                }
                              }}
                              onPaste={(e) => {
                                e.preventDefault();
                                const pastedData = e.clipboardData
                                  .getData('text')
                                  .replace(/[^0-9]/g, '')
                                  .slice(0, 4);
                                setOtpData((prev) => ({ ...prev, otp: pastedData }));

                                // Focus the last filled input or the next empty one
                                const targetIndex = Math.min(pastedData.length, 3);
                                const targetInput = document.querySelector(
                                  `input[data-otp-index="${targetIndex}"]`
                                ) as HTMLInputElement;
                                if (targetInput) targetInput.focus();
                              }}
                              data-otp-index={index}
                              className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-semibold border-stroke rounded-xs border bg-white text-body-color outline-hidden focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none transition-all duration-200 focus:scale-105"
                              pattern="[0-9]"
                              inputMode="numeric"
                            />
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-center items-center space-y-3 sm:space-y-0 sm:space-x-2">
                          <button
                            type="button"
                            onClick={verifyOtp}
                            disabled={loading.verifyingOtp || !otpData.otp || otpData.otp.length !== 4}
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xs bg-primary px-6 py-3 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {loading.verifyingOtp ? (
                              <span className="flex items-center space-x-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                <span>Verifying...</span>
                              </span>
                            ) : (
                              'Verify OTP'
                            )}
                          </button>
                        </div>

                        {otpTimer > 0 && (
                          <p className="mt-3 text-center text-xs text-gray-600 dark:text-gray-400">
                            OTP expires in: {formatTime(otpTimer)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Name and Message Fields - Only show after email verification */}
                  {otpData.verified && (
                    <>
                      <div className="w-full md:w-1/2 px-2 sm:px-4">
                        <div className="mb-6 sm:mb-8">
                          <label htmlFor="name" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="border-stroke w-full rounded-xs border bg-[#f8f8f8] px-4 sm:px-6 py-3 text-sm sm:text-base text-body-color outline-hidden focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="w-full px-2 sm:px-4">
                        <div className="mb-6 sm:mb-8">
                          <label htmlFor="message" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                            Your Message *
                          </label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe your issue or question in detail..."
                            className="border-stroke w-full resize-none rounded-xs border bg-[#f8f8f8] px-4 sm:px-6 py-3 text-sm sm:text-base text-body-color outline-hidden focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none min-h-[100px] sm:min-h-[120px]"
                            required
                          ></textarea>
                        </div>
                      </div>

                      <div className="w-full px-2 sm:px-4">
                        <button
                          type="submit"
                          className="flex items-center justify-center rounded-xs bg-primary px-6 sm:px-9 py-3 sm:py-4 text-sm sm:text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark disabled:cursor-not-allowed disabled:opacity-70 w-full"
                          disabled={loading.submitting || submitted}
                        >
                          {loading.submitting ? (
                            <span className="flex items-center space-x-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              <span>Submitting...</span>
                            </span>
                          ) : submitted ? (
                            <span className="flex items-center space-x-2">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="hidden sm:inline">Submitted (try again after 30 secs)</span>
                              <span className="sm:hidden">Submitted</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-2">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                              </svg>
                              <span className="hidden sm:inline">Submit Support Ticket</span>
                              <span className="sm:hidden">Submit Ticket</span>
                            </span>
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
