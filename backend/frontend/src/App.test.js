import User from './Components/User'
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer
  .create(<User/>)
  .toJSON();
  expect(tree).toMatchSnapshot();
  });