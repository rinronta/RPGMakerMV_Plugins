# RPGMakerMV_Plugins
RPGツクールMVの自作プラグイン置き場です。プラグインは全てMITライセンスで公開しています。  
商用非商用を問わず複製・変更・二次的著作・再頒布を含めたあらゆる形の利用ができます。
本プラグインの利用に関わる責任は利用者自身が負います。  
本プラグインの複製を再頒布する場合、本プラグインの全ての複製に作成者(rinronta)の著作権とMITライセンスを表示する義務があります。

# RRT_StateGroups_beta
ステートをグループ化するプラグインのベータ版です。
## 概要
各ステートを、単一のグループに属させることができます。  
ステートのグループに、以下のような５つの機能を設定することができます。
* 【打消】  
強制的に、１体のキャラに同時に複数の同属ステートを付加することはできなくなります。  
同属ステートが既に付加されているキャラに別の同属ステートを新しく付加する場合に、「打消」が生じます。  
打消は、「上書」「無効」「中和」の３種類の方式のうちいずれかを設定できます。
* 【優先】  
各ステートのノートタグで別個に設定する「ランク値」の高低によって「上書」するか「無効」にするかを選択できます。
ランク値が同じ同属ステート同士は打消の設定に従います。
* 【切替】  
１つのグループにつき最大３種類のフラグ(作動条件)を用いて、ステートを異なるステートに切り替えます。
* 【属性】  
グループに属性を関連づけることで、その属性の攻撃を受けたキャラにグループのステートを付加できます。
* 【相殺】
相対するステートを設定できます。  
相対するグループのステートが既に付加されているキャラに同属ステートを付加させようとすると、お互いのステートが相殺されるように設定できます。
