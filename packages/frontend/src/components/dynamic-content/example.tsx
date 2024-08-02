interface ExtraContentProps {
  username: string;
}

const ExtraContent: React.FC<ExtraContentProps> = ({ username }) => {
  return <div>Welcome, {username}!</div>;
};

export default ExtraContent;
