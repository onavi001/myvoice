import Icon from '../assets/icon.png';
const Header = () => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <header className="bg-[#1A1A1A] p-2 flex items-center fixed top-0 left-0 right-0 z-10">
        <img src={Icon} alt="MyVoice Icon" className="h-8 w-8 mr-2" />
        <h1 className="text-white text-sm font-semibold">MyVoice</h1>
      </header>
    </header>
  );
};

export default Header;