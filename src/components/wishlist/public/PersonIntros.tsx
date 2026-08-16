import { type WishlistPerson } from '../common/people';

export const WishlistPersonIntro: React.FC<{ person: WishlistPerson }> = (props) => {
  const { person } = props;

  switch (person) {
    case 'vadim':
      return <VadimIntro />;
    case 'kotone':
      return <KotoneIntro />;
    case 'haru':
      return <HaruIntro />;
  }
};

const PersonIntro: React.FC<{ children: React.ReactNode }> = (props) => {
  const { children } = props;

  return (
    <div
      className="px-4 text-muted-foreground lg:px-0 [&_li]:mt-1 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mb-0
        [&_ul]:list-disc [&_ul]:pl-5"
    >
      {children}
    </div>
  );
};

const VadimIntro: React.FC = () => (
  <PersonIntro>
    <p>Things Vadim would love to receive.</p>
  </PersonIntro>
);

const KotoneIntro: React.FC = () => (
  <PersonIntro>
    <p>Kotone currently doesn't have anything she wants, your presence is more than enough.</p>
  </PersonIntro>
);

const HaruIntro: React.FC = () => (
  <PersonIntro>
    <p>Haru is still under 6 months old, but is growing fast.</p>
    <p>* No toys please, he has plenty.</p>
  </PersonIntro>
);
