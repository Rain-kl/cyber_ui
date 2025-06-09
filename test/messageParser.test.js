// Test cases for message parser
import { parseMessageContent } from '../utils/messageParser';

// Test case 1: Simple thinking block
const test1 = "Hello <think>Let me think about this...</think> World!";
console.log('Test 1 - Complete thinking block:', parseMessageContent(test1));

// Test case 2: Incomplete thinking block
const test2 = "Hello <think>I'm still thinking...";
console.log('Test 2 - Incomplete thinking block:', parseMessageContent(test2));

// Test case 3: Multiple thinking blocks
const test3 = "First <think>thinking 1</think> middle <think>thinking 2</think> end";
console.log('Test 3 - Multiple thinking blocks:', parseMessageContent(test3));

// Test case 4: No thinking blocks
const test4 = "Just a normal message";
console.log('Test 4 - No thinking blocks:', parseMessageContent(test4));

// Test case 5: Mixed with incomplete
const test5 = "Start <think>complete</think> middle <think>incomplete...";
console.log('Test 5 - Mixed complete and incomplete:', parseMessageContent(test5));
