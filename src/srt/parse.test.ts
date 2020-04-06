import 'jest';
import { parse } from './parse';

const example = `
1
00:00:35,652 --> 00:00:42,252
<i>There once was a peculiar doctor
known for his extraordinary ability.</i>\n\n

2
00:00:42,332 --> 00:00:46,376
<i>He could talk to animals.</i>\n\n

3
00:00:46,853 --> 00:00:49,848
<i>Doctor Dolittle's reputation
spread far and wide.</i>\n\n

4
00:00:49,928 --> 00:00:53,184
<i>Even the Queen of England called on him.</i>\n\n
`

test('parse examples', ()=>{
  console.log(example);
  const result = parse(example);
  console.log(result);
})
