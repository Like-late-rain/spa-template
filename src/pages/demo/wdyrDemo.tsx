import { useImmer } from '@/hooks/useImmer';
import { counterAtom, doubleCountAtom, blank } from '@/stores/demoAtoms';
import { useAtom, useAtomValue } from 'jotai';

const Index = () => {
  const [data, setData] = useImmer({ str: '无意义渲染' });
  const [blankValue, setBlank] = useAtom(blank);
  const counter = useAtomValue(counterAtom);
  const doubleCount = useAtomValue(doubleCountAtom);
  console.log('wdyrDemo 渲染');
  return (
    <div>
      <div>count:{counter.count}</div>
      <div>step:{counter.step}</div>

      <div>doubleCount:{doubleCount}</div>
      <div>
        <div>blank: {blankValue}</div>
        <button
          type="button"
          onClick={() => {
            // setData({ str: '无意义渲染' })
            setBlank(blankValue + 1);
          }}
        >
          blank +1
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          // setData({ str: '无意义渲染' })
          setData((draft) => {
            draft.str = '无意义渲染';
          });
        }}
      >
        {data.str}
      </button>
    </div>
  );
};

Index.whyDidYouRender = true;
export default Index;
