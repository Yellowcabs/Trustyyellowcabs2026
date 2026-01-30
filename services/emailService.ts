import { BookingDetails } from '../types';

// Helper function to convert 24-hour time to 12-hour format
const formatTo12Hour = (time24: string): string => {
  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; // converts 0 => 12, 13 => 1, etc.
  return `${hour}:${minute} ${ampm}`;
};

export const sendBookingEmail = async (details: BookingDetails): Promise<boolean> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("API configuration is missing. Please ensure the environment is correctly set up.");
    return false;
  }

  const url = "https://api.brevo.com/v3/smtp/email";

  const recipients = [
    { email: "trustyyellowcabs@gmail.com", name: "Trustyyellowcabs Admin" }
  ];

  if (details.email) {
    recipients.push({ email: details.email, name: details.name });
  }

  // Format time to 12-hour before inserting into email
  const formattedTime = formatTo12Hour(details.time);

  const emailContent = {
    sender: { name: "Trustyyellowcabs Booking", email: "trustyyellowcabs@gmail.com" },
    to: recipients,
    subject: `New Ride Booking: ${details.pickup} to ${details.drop}`,
    htmlContent: `
      <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #FDB813; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">New Booking Request</h1>
        </div>
        <div style="padding: 30px;">
          <p>You have a new booking request from the website:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Customer:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${details.name}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${details.phone}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Pickup:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${details.pickup}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Drop:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${details.drop}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Date/Time:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${details.date} at ${formattedTime}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><strong>Vehicle:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${details.vehicleType}</td></tr>
          </table>
          <div style="margin-top: 30px; text-align: center;">
            <a href="tel:${details.phone}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Call Customer Now</a>
          </div>
        </div>
      </div>
    `
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailContent)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.warn("Booking service notification failed:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Network error during booking processing:", error);
    return false;
  }
};
