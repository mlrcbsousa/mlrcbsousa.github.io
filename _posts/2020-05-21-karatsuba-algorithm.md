---
title:  "The Karatsuba Multiplication Algorithm"
date:   2020-05-19 00:16:21 +0200
categories: algorithms ruby
---

Recently I have become more and more curious about **thinking like a computer scientist**. Thinking about things in high level concepts and patterns allows to grasp the birds eye view of a problem and apply the same reasoning to a wide variety of circumstances. 

I have also discovered people like [**Bjarne Stroustrup**](https://en.wikipedia.org/wiki/Bjarne_Stroustrup) and others and along the lines of things they say includes certain **must haves** of a _"card carrying"_ Software Engineer.

# My First Algorithm Implementation

In working towards that goal of broader understanding I recently took up [Standford's Online Algorithm's Course](https://www.coursera.org/learn/algorithms-divide-conquer) offered by the popular online learning platform [Coursera](https://www.coursera.org/).

I am still on the first week, and I am not doing the course with a lower level language like **C++** or a recommended popular one like **Python**. Nonetheless I figure I can use the language I am comfortable with - **Ruby** - whilst I keep learning the others. 

It has been quite challenging, one of the multiple choice questions in the Problem Set for this first week had me retry it enough times to get to the right answer by elimination. But even then I learned new interesting things along the way. Such as this awesome [graphing tool](https://www.desmos.com/calculator) to compare rate of growth of different functions.

## Karatsuba Multiplication

So it turns out quite interestingly enough that there's more then one way to multiply two integers, beyond the one we learn in school. Mind blowing I know. One such way is this cool sounding [Karatsuba Algorithm](https://en.wikipedia.org/wiki/Karatsuba_algorithm) which was the subject of our first week's programming assignment.

Below I will try **going through my thinking** to get to my final implementation which accurately calculated the assigned multiplication of two integers of 64 digits length.

> Here is the link to [the code repository](https://github.com/mlrcbsousa/coursera-algorithms/tree/master/karatsuba) with the final implementation.

### Pseudocode

In true programmer fashion lets start with the **Pseudocode**, explained nicely in one of the lecture videos. I won't be going through the proof for the algorithm or why the algorithm is more efficient then the **"Grade School Algorithm"** we are taught in school. Suffice to say that the grade school algorithm has a time complexity of \\( O(n^2) \\) whilst the faster Karatsuba algorithm has a time complexity of \\( O(n^{\log_2 3}) \\).

#### The Steps

For the product of two integers `x` and `y` of length `n` that can be represented in the following way:

- \\( x=10^{\frac{n}{2}}a+b \\)
- \\( y=10^{\frac{n}{2}}c+d \\)

So for example if:

\\begin{align}
x=1234\\\
y=5678
\\end{align}

Then our four letters would represent

\\begin{align}
a = 12\\\
b = 34\\\
c = 56\\\
d = 78
\\end{align}

So far so good.

The following steps will produce the product:

1. The **product** of `a` and `c` - \\((Step\ 1 - S_1)\\)
2. The **product** of `b` and `d` - \\((S_2)\\)
3. The **product** of `(a + b)` and `(c + d)` - \\((S_3)\\)
4. The **result** of \\(S_1\\) and \\(S_2\\) subtracted from \\(S_3\\) - \\((S_4)\\)
5. The result _(Product)_ which is the final **sum** of:

\\begin{align}
&S_1 \times 10^n\\\
+\ &S_2\\\
+\ &S_4 \times 10^{\frac{n}{2}}\\\
\\end{align}

I know it seems crazy, like pulled out of nowhere, but I encourage you to go find out why it works, it actually makes **some** sense once you see the proof.

So in our example case above this would come down to:

\\begin{align}
12\times 56&=672\\\
34\times 78&=2852\\\
(12+34)\times (56+78)&=6164\\\
6164-672-2652&=2840\\\
\\\
6720000&\\\
+\ 2652&\\\
+\ 284000&\\\
=7006652&
\\end{align}

And indeed if you plug `1234` and `5678` in a calculator you get the answer of `7006652` for their product. Pretty cool huh, of course the fact that it works for this 4 digit number pair doesn't mean it works for all integers of any length, this is just an **illustrative example** not the proof.

#### Setup

To set myself up I opened up a [ruby](https://www.ruby-lang.org/en/) file and added in the above example as a test case with the helpful `rspec/autorun` module. Of course some form of **debugging** with `byebug` in order to be able to step through the program and an empty method with a hard coded return value to pass a test and go through our code once. A **"sanity test"** as would be called in a unit test case. 

```ruby
require 'rspec/autorun'
require 'byebug'

def karatsuba(x, y)
  100
end 

RSpec.describe self.class do
  subject do
    described_class.send(:karatsuba, x, y)
  end

  context '10 and 10' do
    let(:x) { 10 }
    let(:y) { 10 }

    it { is_expected.to eq(100) }
  end
end
```

I like to use the helpers in [RSpec](https://rspec.info/), things like the `subject` and `let` blocks and the `described_class` method. Since the implementation method is defined on the `main` **Object** class session above it I used the `self.class` as the first argument to the first describe block, but otherwise nothing fancy just a regular spec.

#### First Implementation

So to start me off on the actual implementation I decided to code up the steps for one loop, so going through them once without taking **recursion** into consideration. This naively made me think of some assumptions I would have to make, however they quickly become obsolete once I got to the recursion part.

> **Naive Assumptions**
> - both `x` and `y` have the same length `n`  
> - the length `n` is a power of 2         

The second assumption would allow me to assume the length to always be divisible by 2. **Ironically** this thinking would become once again useful towards the end of this exercise, after briefly assuming it to be wrong.

So here was roughly my code for the one loop going through each of the algorithm steps described above.

```ruby
def karatsuba(x, y)
  x_s = x.to_s
  y_s = y.to_s

  # x and y have the same length
  n = x_s.length

  h = n/2                                        
  o = h - 1                                       # Gotcha number 1

  # x = 10^(n/2) * a + b
  # y = 10^(n/2) * c + d
  a = x_s[0..o].to_i
  b = x_s[h..].to_i
  c = y_s[0..o].to_i
  d = y_s[h..].to_i

  # step 1
  s1 = a * c

  # step 2
  s2 = b * d

  # step 3
  s3 = (a + b) * (c + d)

  # step 4
  s4 = s3 - s2 - s1

  # step 5
  (s1 * 10**n) + s2 + (s4 * 10**h) 
end
```

The first Gotcha I had was the use of the string splitting with the Ruby array notation `[]`, forgetting that the halfway point would start incremented by one for the second half. Innocent enough, quickly fixed it and added our `h` and `o` variables, for **offset** and **half**.

> I usually do not like single letter variables, and would use the full word `offset` and `half` or `half_length` but I felt it would clutter the math formulas and make it harder for me to read, which is the purpose of the written out long word anyways in other contexts. So went with the abbreviations. 

This was enough to plug into the test case used in the example above:

```ruby
context '1234 and 5678' do
  let(:x) { 1234 }
  let(:y) { 5678 }

  it { is_expected.to eq(7006652) }
end
```

Once that was going, on to the next big step - **recursion**

#### Recursion

For recursion I needed a **break point condition** and pertinent places to call the function from inside itself. Since our method is about multiplying two integers together its quickly clear that it can be employed in steps **1**, **2** and **3** of the algorithm.

For a break point I used the recommended restriction of once the length of the integers got down to single digits just return the conventional multiplication of the two numbers.

So I added the following return condition at the top of the method after getting the length of the passed in integers:
```ruby
return x * y if n == 1 # base case
```

And for each of the three steps in the algorithm that use multiplication I substituted with a recursive call of the function to itself:
```ruby
def karatsuba(x, y)
  ...
  # step 1
  s1 = karatsuba(a, c)
    
  # step 2
  s2 = karatsuba(b, d)
    
  # step 3
  s3 = karatsuba((a + b), (c + d))
  ...
end
```

Cool! Recursion done! Once running it through my test though, it failed, _haha!_ 

#### Assumption 1 - `Y` not care! Get it?

I thought the best way to figure out where it's failing will be to setup test cases for the first layer of recursive calls to the function for our `1234` `5678` example.

```ruby
context '12 and 56' do
  let(:x) { 12 }
  let(:y) { 56 }

  it { is_expected.to eq(672) }
end

context '34 and 78' do
  let(:x) { 34 }
  let(:y) { 78 }

  it { is_expected.to eq(2652) }
end
```

So far so good..

```ruby
context '46 and 134' do
  let(:x) { 46 }
  let(:y) { 134 }

  it { is_expected.to eq(6164) }
end
```

Boom!

Yes so our lofty notions of strict lengths divisible by 2 and equal lengths of the two inputs were shattered in the same case.

After some trial and error and some thinking it occurred to me that I do need to take into consideration the two input lengths:

```ruby
n_x = x_s.length
n_y = y_s.length
return x * y if n_x == 1 && n_y == 1 # base case
```

Which then meant some logic needed to pick the longest one as the length `n`:

```ruby
# x and y have the same length
n = n_x 

if n_x < n_y
  n = n_y 
end
```

#### Assumption 2 - length `n` divisible by 2

So then OK, I'm using the biggest length, but what happens with the division by 2? How do I split the inputs in half when the length is odd? Do I offset the extra 1 towards `a` or `b`?

So I played around with the example above, `134` and `46`. If I went with:
```
a = 1 ; b = 34 ; c = 4 ; d = 6
```
It was better then:
```
a = 13 ; b = 4 ; c = 46 ; d = 0
```
In fact the latter was horrible and just plain wrong but the former not too good either, that led me to thinking about **padding**.

Using the debugger and stepping through the code to see what values were stored in variables `a`, `b`, `c` and `d` in different cases I realized the half splitting wasn't going to work unless I padded the smaller length number with **zeros**. Otherwise the string splitter would start counting too early and I would end up with a plain wrong variable assignment like `c = 46` above.

So I played around and came up with this:
```ruby
n = n_x
if n_x < n_y
  n = n_y
  dx = n - n_x
  x_s = '0' * dx + x_s
else
  dy = n - n_y
  y_s = '0' * dy + y_s
end
```

I thought it would be disingenuous to assume the length difference between the two inputs might only be 1, so I added the calculation of the padding amount based on whichever the length difference it would be, using `dx` or `dy`.

> I know from starting to learn other more low level languages, that this freedom to play around between the integer and string type is **not** a feature generally so easily available.
>
> Regardless, I think it detracts from the point of time complexity - at least in theory - that it is asymptotic and agnostic in the sense that it is a high level thinking tool independent of the programming language or hardware.
>
> So assuming that I could, even if with more code, do some form of the above in another programming language, I moved on.

#### The Road to Big Number Accuracy

This was better, my home baked test cases were passing. I thought I was almost home clear. So I followed the recommended advice by the course website - to test my implementation with some more **challenging** pairs of numbers. They make these available in `txt` files in a [code repository](https://github.com/beaunus/stanford-algs/tree/master/testCases/course1/assignment1Multiplication). 

Browsing and opening some of these text files was somewhat surprising and intimidating, some of these numbers were huge, even **bigger** then the assignment challenge of two **64 digit** inputs!

I used the following code snippet to load them up after cloning the repo:
{% gist 15a6f8ed1d53410e6a493224cda0e492 %}

After some debugging to get to the version above.. 

You need a `context` block around the inner most `let` and `it` blocks or else the class variables will be reassigned and not saved in the scope of each iteration. Giving you the same expected result for all the iterations.

I think I got **34** out of 35 failures on a first run. Wow, so something was going on with the length situation.

One of the 34 failures was a **small example**, I believe it was `5077` and `8319` or something like that. Once again I decided to **break that down** into its constituent inner recursive calls and see where it was failing in some place I could maybe reproduce manually on a piece of paper. 

#### Some Random Chance

One of the inner recursive test calls was giving me a **step 4** situation with a length moving one to the left too far, or too close. The length decisions were not clear and clean. By chance I thought of how in some of the previous simpler cases it was working but in some others with larger inputs, it wasn't.

So I thought the **remainder of 1** on odd lengths is also **sometimes** there and when the lengths are even it's not. That kind of follows the _"sometimes yes - sometimes no"_ that seems to be happening here. So I went with a random trial and added the following to the last line of my implementation.

```ruby
# step 5
(s1 * 10**n) + s2 + (s4 * 10**(h + n%2))  
```

It worked! At least for those broken down examples. I even put a comment saying exactly to myself `No clue why this works`.

To be clear, I added a modulo of `n` to the exponent of 10 multiplying the result of **S4**.

I ran the test cases from the course repo again - **23** out 35 failures.

Better..

So I was onto something here with the **modulo**. Turns out, after going through the **same process** of picking the simplest failing case, breaking it down, trying it manually on a piece of paper. That the length should be **"forced"** to be divisible by 2, that the padding then **might** happen on both inputs and that will yield our **correct result**.. _After removing the random chance modulo from step 5 above_.

So this was the final missing piece I needed:
```ruby
n = n_x + n_x%2                         # Gotcha number 5

if n_x < n_y
  n = n_y + n_y%2                       
end

# Pad zeros to get to a length divisible by 2
dy = n - n_y
y_s = '0' * dy + y_s

dx = n - n_x
x_s = '0' * dx + x_s
```

All in all a very rewarding exercise. Can't wait to get to the next ones.

Still struggling with the **Big O** notation and it's brother and sister **theta** and **omega** but I'll get there.

The code for my final implementation is in this [code repository link](https://github.com/mlrcbsousa/coursera-algorithms/tree/master/karatsuba).

Until next time!