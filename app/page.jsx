
import HistoryButton from '@/components/HistoryButton/HistoryButton';
import SlotMachiene from '@/components/SlotMachiene/SlotMachiene'
import UserHeader from '@/components/UserHeader/UserHeader';

export default function Home() {
  return (
    <div>
      <UserHeader/>
      <SlotMachiene/>
      <HistoryButton/>
    </div>
  );
}
