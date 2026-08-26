export function DashboardAnimations() {
  return (
    <style jsx global>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .animate-fade-in-up {
        opacity: 0;
        animation: fadeInUp 0.6s ease-out forwards;
      }

      .animate-slide-in-left {
        opacity: 0;
        animation: slideInLeft 0.5s ease-out forwards;
      }

      .page-enter {
        opacity: 0;
      }

      .page-enter-active {
        opacity: 1;
        transition: opacity 0.3s ease-in;
      }
    `}</style>
  );
}
