
'use client';
import * as React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage({ params }: { params: Promise<{ lang: 'en' | 'gu' }> }) {
  const { lang } = React.use(params);

  const translations = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: July 30, 2024',
      introduction: 'JD News ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.',
      sections: [
        {
          title: '1. Information We Collect',
          content: 'We may collect information about you in a variety of ways. The information we may collect on the Site includes: <br/><br/> <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic information, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards. <br/><br/> <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.',
        },
        {
          title: '2. Use of Your Information',
          content: 'Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to: <br/> - Create and manage your account. <br/> - Email you regarding your account or order. <br/> - Fulfill and manage purchases, orders, payments, and other transactions related to the Site. <br/> - Increase the efficiency and operation of the Site. <br/> - Monitor and analyze usage and trends to improve your experience with the Site.',
        },
        {
          title: '3. Disclosure of Your Information',
          content: 'We may share information we have collected about you in certain situations. Your information may be disclosed as follows: <br/><br/> <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation. <br/><br/> <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.',
        },
        {
            title: '4. Cookies and Web Beacons',
            content: 'We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.',
        },
        {
          title: '5. Security of Your Information',
          content: 'We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.',
        },
        {
          title: '6. Policy for Children',
          content: 'We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.',
        },
        {
            title: '7. Changes to This Privacy Policy',
            content: 'We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page.',
        },
        {
          title: '8. Contact Us',
          content: 'If you have questions or comments about this Privacy Policy, please contact us at: <br/> Email: jdnewsgujarati@gmail.com <br/> Phone: +91 9773242022',
        },
      ],
    },
    gu: {
      title: 'ગોપનીયતા નીતિ',
      lastUpdated: 'છેલ્લું અપડેટ: ૩૦ જુલાઈ, ૨૦૨૪',
      introduction: 'જેડી ન્યૂઝ ("અમે," "અમારા," અથવા "અમને") તમારી ગોપનીયતાનું રક્ષણ કરવા માટે પ્રતિબદ્ધ છે. આ ગોપનીયતા નીતિ સમજાવે છે કે જ્યારે તમે અમારી વેબસાઇટની મુલાકાત લો છો ત્યારે અમે તમારી માહિતી કેવી રીતે એકત્રિત કરીએ છીએ, ઉપયોગ કરીએ છીએ, જાહેર કરીએ છીએ અને સુરક્ષિત કરીએ છીએ.',
      sections: [
        {
          title: '૧. અમે એકત્રિત કરેલી માહિતી',
          content: 'અમે તમારા વિશે વિવિધ રીતે માહિતી એકત્રિત કરી શકીએ છીએ. સાઇટ પર અમે જે માહિતી એકત્રિત કરી શકીએ છીએ તેમાં શામેલ છે: <br/><br/> <strong>વ્યક્તિગત ડેટા:</strong> વ્યક્તિગત રીતે ઓળખી શકાય તેવી માહિતી, જેમ કે તમારું નામ, ઇમેઇલ સરનામું અને વસ્તી વિષયક માહિતી, જે તમે સાઇટ પર નોંધણી કરતી વખતે અથવા જ્યારે તમે સાઇટ સંબંધિત વિવિધ પ્રવૃત્તિઓમાં ભાગ લેવાનું પસંદ કરો છો, જેમ કે ઑનલાઇન ચેટ અને મેસેજ બોર્ડ, ત્યારે તમે સ્વેચ્છાએ અમને આપો છો. <br/><br/> <strong>ડેરિવેટિવ ડેટા:</strong> જ્યારે તમે સાઇટને ઍક્સેસ કરો છો ત્યારે અમારા સર્વર્સ આપમેળે એકત્રિત કરે છે તે માહિતી, જેમ કે તમારું IP સરનામું, તમારો બ્રાઉઝર પ્રકાર, તમારી ઑપરેટિંગ સિસ્ટમ, તમારા ઍક્સેસ સમય અને તમે સાઇટને ઍક્સેસ કરતા પહેલા અને પછી સીધા જોયેલા પૃષ્ઠો.',
        },
        {
          title: '૨. તમારી માહિતીનો ઉપયોગ',
          content: 'તમારા વિશે સચોટ માહિતી હોવાને કારણે અમને તમને સરળ, કાર્યક્ષમ અને કસ્ટમાઇઝ્ડ અનુભવ પ્રદાન કરવાની પરવાનગી મળે છે. ખાસ કરીને, અમે સાઇટ દ્વારા તમારા વિશે એકત્રિત કરેલી માહિતીનો ઉપયોગ આ માટે કરી શકીએ છીએ: <br/> - તમારું એકાઉન્ટ બનાવો અને સંચાલિત કરો. <br/> - તમારા એકાઉન્ટ અથવા ઓર્ડર સંબંધિત તમને ઇમેઇલ કરો. <br/> - સાઇટ સંબંધિત ખરીદી, ઓર્ડર, ચુકવણી અને અન્ય વ્યવહારો પૂર્ણ કરો અને સંચાલિત કરો. <br/> - સાઇટની કાર્યક્ષમતા અને કામગીરીમાં વધારો કરો. <br/> - સાઇટ સાથેના તમારા અનુભવને સુધારવા માટે વપરાશ અને વલણોનું નિરીક્ષણ અને વિશ્લેષણ કરો.',
        },
        {
          title: '૩. તમારી માહિતીનું પ્રકટીકરણ',
          content: 'અમે અમુક પરિસ્થિતિઓમાં તમારા વિશે એકત્રિત કરેલી માહિતી શેર કરી શકીએ છીએ. તમારી માહિતી નીચે મુજબ જાહેર કરી શકાય છે: <br/><br/> <strong>કાયદા દ્વારા અથવા અધિકારોનું રક્ષણ કરવા માટે:</strong> જો અમને લાગે છે કે તમારા વિશેની માહિતીનું પ્રકાશન કાનૂની પ્રક્રિયાને પ્રતિસાદ આપવા, અમારી નીતિઓના સંભવિત ઉલ્લંઘનોની તપાસ કરવા અથવા તેનું નિવારણ કરવા, અથવા અન્યના અધિકારો, મિલકત અને સલામતીનું રક્ષણ કરવા માટે જરૂરી છે, તો અમે કોઈપણ લાગુ કાયદા, નિયમ અથવા વિનિયમ દ્વારા પરવાનગી અથવા આવશ્યકતા મુજબ તમારી માહિતી શેર કરી શકીએ છીએ. <br/><br/> <strong>તૃતીય-પક્ષ સેવા પ્રદાતાઓ:</strong> અમે તમારી માહિતી તૃતીય પક્ષો સાથે શેર કરી શકીએ છીએ જે અમારા માટે અથવા અમારી વતી સેવાઓ કરે છે, જેમાં ચુકવણી પ્રક્રિયા, ડેટા વિશ્લેષણ, ઇમેઇલ ડિલિવરી, હોસ્ટિંગ સેવાઓ, ગ્રાહક સેવા અને માર્કેટિંગ સહાયનો સમાવેશ થાય છે.',
        },
        {
            title: '૪. કૂકીઝ અને વેબ બીકન્સ',
            content: 'અમે સાઇટને કસ્ટમાઇઝ કરવામાં અને તમારા અનુભવને સુધારવામાં મદદ કરવા માટે સાઇટ પર કૂકીઝ, વેબ બીકન્સ, ટ્રેકિંગ પિક્સેલ્સ અને અન્ય ટ્રેકિંગ તકનીકોનો ઉપયોગ કરી શકીએ છીએ. જ્યારે તમે સાઇટને ઍક્સેસ કરો છો, ત્યારે તમારી વ્યક્તિગત માહિતી ટ્રેકિંગ તકનીકના ઉપયોગ દ્વારા એકત્રિત કરવામાં આવતી નથી. મોટાભાગના બ્રાઉઝર્સ ડિફૉલ્ટ રૂપે કૂકીઝ સ્વીકારવા માટે સેટ હોય છે. તમે કૂકીઝને દૂર કરી શકો છો અથવા નકારી શકો છો, પરંતુ ધ્યાન રાખો કે આવી ક્રિયા સાઇટની ઉપલબ્ધતા અને કાર્યક્ષમતાને અસર કરી શકે છે.',
        },
        {
          title: '૫. તમારી માહિતીની સુરક્ષા',
          content: 'અમે તમારી વ્યક્તિગત માહિતીને સુરક્ષિત કરવામાં મદદ કરવા માટે વહીવટી, તકનીકી અને ભૌતિક સુરક્ષા પગલાંનો ઉપયોગ કરીએ છીએ. જ્યારે અમે તમે અમને પ્રદાન કરેલી વ્યક્તિગત માહિતીને સુરક્ષિત કરવા માટે વાજબી પગલાં લીધાં છે, ત્યારે કૃપા કરીને ધ્યાન રાખો કે અમારા પ્રયત્નો છતાં, કોઈ સુરક્ષા પગલાં સંપૂર્ણ અથવા અભેદ્ય નથી, અને ડેટા ટ્રાન્સમિશનની કોઈ પણ પદ્ધતિ કોઈપણ અવરોધ અથવા અન્ય પ્રકારના દુરૂપયોગ સામે ખાતરી આપી શકાતી નથી.',
        },
        {
          title: '૬. બાળકો માટે નીતિ',
          content: 'અમે 13 વર્ષથી ઓછી ઉંમરના બાળકો પાસેથી જાણીજોઈને માહિતી માંગતા નથી અથવા માર્કેટિંગ કરતા નથી. જો તમને 13 વર્ષથી ઓછી ઉંમરના બાળકો પાસેથી અમે એકત્રિત કરેલા કોઈપણ ડેટા વિશે જાણ થાય, તો કૃપા કરીને નીચે આપેલી સંપર્ક માહિતીનો ઉપયોગ કરીને અમારો સંપર્ક કરો.',
        },
        {
            title: '૭. આ ગોપનીયતા નીતિમાં ફેરફાર',
            content: 'અમે અમારી પ્રથાઓમાં ફેરફાર અથવા અન્ય ઓપરેશનલ, કાનૂની અથવા નિયમનકારી કારણોસર, ઉદાહરણ તરીકે, આ ગોપનીયતા નીતિને સમયાંતરે અપડેટ કરી શકીએ છીએ. અમે આ પૃષ્ઠ પર નવી ગોપનીયતા નીતિ પોસ્ટ કરીને તમને કોઈપણ ફેરફારો વિશે સૂચિત કરીશું.',
        },
        {
          title: '૮. અમારો સંપર્ક કરો',
          content: 'જો તમને આ ગોપનીયતા નીતિ વિશે પ્રશ્નો અથવા ટિપ્પણીઓ હોય, તો કૃપા કરીને અમારો સંપર્ક કરો: <br/> ઇમેઇલ: jdnewsgujarati@gmail.com <br/> ફોન: +91 9773242022',
        },
      ],
    },
  };

  const t = translations[lang];

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
                <Shield className="w-10 h-10 text-primary" />
                <h1 className="font-headline text-5xl md:text-6xl font-bold">{t.title}</h1>
            </div>
          <p className="text-muted-foreground">{t.lastUpdated}</p>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-full bg-card p-8 rounded-lg shadow-sm">
            <p className="lead">{t.introduction}</p>
            {t.sections.map((section, index) => (
                <div key={index} className="mt-8">
                    <h2 className="font-headline text-2xl font-bold text-primary">{section.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
