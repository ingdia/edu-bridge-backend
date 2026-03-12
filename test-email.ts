// test-email.ts
import 'dotenv/config';
import { sendWelcomeEmail } from './src/services/email.service';

async function testEmail() {
  console.log('🧪 Testing email configuration...\n');
  
  try {
    await sendWelcomeEmail(
      process.env.SMTP_USER || 'test@example.com',
      'Test User',
      {
        email: process.env.SMTP_USER || 'test@example.com',
        role: 'STUDENT',
        schoolName: 'GS Ruyenzi',
        isStudent: true,
        platformUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      }
    );
    
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Check your inbox: ${process.env.SMTP_USER}`);
    console.log('\n✨ Email configuration is working perfectly!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test email failed:', error);
    console.error('\n⚠️ Please check your SMTP credentials in .env file\n');
    process.exit(1);
  }
}

testEmail();
