export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col" style={{ marginTop: '6rem' }}>
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white/90 mb-6 text-center">
            Privacy Policy
          </h1>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
              src="/privacy-policy.pdf"
              className="w-full h-[80vh]"
              title="Privacy Policy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}