//=============================================================================
// RRT_StateGroups_beta.js
// ----------------------------------------------------------------------------
// Copyright (c) 2018 RINRONTA
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 0.2.0 2018/05/06 beta版公開
//=============================================================================
/*~struct~groupSetting:
 *
 * @param name
 * @desc グループの名前、あるいはメモ。処理には関わらないので入力形式は問わず。
 * @type note
 * @default noName
 *
 * @param type
 * @desc 打消方式。同属・同格のステートのうち先に付加されたものと後から付加されるもの、どちらを打ち消すか。
 * @type select
 * @option 【上書(overwrite)】前者無効、後者有効(デフォルト)
 * @value overwrite
 * @option 【無効(cancel)】前者有効、後者無効
 * @value cancel
 * @option 【中和(neutralize)：前者無効、後者無効
 * @value neutralize
 * @default overwrite
 *
 * @param rankType
 * @desc 優先方式。ランクによる強弱の方式。ノートタグがない場合は自動的にステートの優先度がランク値になる。
 * @type select
 * @option 【ランクなし(none)】ランク値にかかわらず常に打消タイプに従う
 * @value none
 * @option 【高ランク優先(higher)】高ランク有効、低ランク無効
 * @value higher
 * @option 【低ランク優先(lower)】低ランク有効、高ランク有効
 * @value lower
 * @default none
 *
 * @param flag
 * @desc 通常切替フラグ。切替の条件。ステートの解除条件各項目に一致。
 * @type select
 * @option 【なし(none)】このフラグを用いない
 * @value none
 * @option 【戦闘終了時(battleEnd)】チェックがなくても作動
 * @value battleEnd
 * @option 【行動制約時(restrict)】チェックがなくても作動
 * @value restrict
 * @option 【継続ターン数(turns)】チェックがなければ作動せず
 * @value turns
 * @option 【被ダメージ時(damage)】チェックがなくても作動
 * @value damage
 * @option 【歩数(steps)】チェックがなければ作動せず
 * @value steps
 * @default none
 *
 * @param xFlag
 * @desc 拡張切替フラグ。各ステートのタグ<RSGxRate:xxx>で確率の設定が可能(デフォルトは100)。
 * @type select
 * @option 【なし(none)】このフラグを用いない(デフォルト)
 * @value none
 * @option 【解除時(remove)】解除時に切替が発生
 * @value remove
 * @option 【戦闘開始時(battleStart)】戦闘開始時に切替発生
 * @value battleStart
 * @option 【初回行動時(firstAction)】ターン初回行動時(直前)に切替発生
 * @value firstAction
 * @option 【全行動終了時(allActionsEnd)】行動終了時に切替発生
 * @value allActionsEnd
 * @option 【行動終了時(turnEnd)】ターン終了時に切替発生
 * @value turnEnd
 * @default none
 *
 * @param sFlag
 * @desc 特殊切替フラグ。sValueの値が必要。各ステートのタグ<RSGxRate:xxx>で確率の設定が可能(デフォルトは100)。
 * @type select
 * @option 【なし(none)】このフラグを用いない
 * @value none
 * @option 【ステート(addedState)】特定ステートの付加
 * @value addedState
 * @option 【ステートグループ(addedStateGroup)】特定グループのステートの付加
 * @value addedStateGroup
 * @option 【属性攻撃(damagedElement)】特定属性で攻撃を受けた時
 * @value damagedElement
 * @option 【使用スキル(usingSkill)】特定のスキルを使用時(直前)
 * @value usingSkill
 * @option 【使用スキルタイプ(usingSkillType)】特定のスキルタイプを使用時(直前)
 * @value usingSkillType
 * @option 【能力値(param)】特定の能力値
 * @value param
 * @option 【HP/MP/TP割合(rateOfHMT)】HP/MP/TPの残存割合
 * @value rateOfHMT
 * @default none
 *
 * @param sValue
 * @desc sFlagによって参照される値。半角英数小文字。ステートなら原因のステートid、能力値はアルファベット略称で入力。
 * @type string
 * @default none
 *
 * @param target
 * @desc 切替先ステート。
 * @type select
 * @option 【解除(none)】解除のみ。
 * @value none
 * @option 【ランクアップ(rankUp)】次に高いランクのステートに切替
 * @value rankUp
 * @option 【ランクダウン(rankDown)】次に低いランクのステートに切替
 * @value rankDown
 * @option 【ランダム(random)】グループ内でランダムに切替
 * @value random
 * @option 【指定ステート(state)】タグで指定したステートに切替
 * @value state
 * @default none
 *
 * @param element
 * @desc グループ属性。指定した属性で攻撃されたとき、グループ内のステート(代表ステートorランダム)が付加される。
 * @type number
 * @default 0
 *
 * @param eRate
 * @desc グループ属性による付加の確率。
 * @type number
 * @min 0
 * @max 100
 * @default 0
 *
 * @param counter
 * @desc 相殺グループ。既に付加されている相殺グループに属するステートを解除し、自分のグループの付加も無効にする。
 * @type number
 * @default 0
 *
 */
/*:
 * @plugindesc ステートグループ化プラグイン
 * @author RINRONTA
 *
 * @param STATE_GROUP1
 * @desc ノートタグ：<RSGgroupId:1>
 * @type struct<groupSetting>
 *
 * @param STATE_GROUP2
 * @desc ノートタグ：<RSGgroupId:2>
 * @type struct<groupSetting>
 *
 * @param STATE_GROUP3
 * @desc ノートタグ：<RSGgroupId:3>
 * @type struct<groupSetting>
 *
 * @param STATE_GROUP4
 * @desc ノートタグ：<RSGgroupId:4>
 * @type struct<groupSetting>
 *
 * @param STATE_GROUP5
 * @desc ノートタグ：<RSGgroupId:5>
 * @type struct<groupSetting>
 *
 * @param STATE_GROUP6
 * @desc ノートタグ：<RSGgroupId:6>
 * @type struct<groupSetting>
 *
 * @param STATE_GROUP7
 * @desc ノートタグ：<RSGgroupId:7>
 * @type struct<groupSetting>
 *
 * @param STATE_GROUP8
 * @desc ノートタグ：<RSGgroupId:8>
 * @type struct<groupSetting>
 *
 * @param STATE_GROUP9
 * @desc ノートタグ：<RSGgroupId:9>
 * @type struct<groupSetting>
 *
 * @param STATE_GROUP10
 * @desc ノートタグ：<RSGgroupId:10>
 * @type struct<groupSetting>
 *
 * @param EXPANSION
 * @type struct<groupSetting>[]
 * @desc 11グループ以上が必要の場合、<RSGgroupId:11>からのグループをここで拡張可能。groupId=行番号+10
 *
 * @help
 *-----------------------------------------------------------------------------
 * 概要
 *-----------------------------------------------------------------------------
 * ステートをグループ化させ、条件に従ってグループ内あるいは
 + 他のステートへステートを切り替える仕組みを導入できます。
 *
 *-----------------------------------------------------------------------------
 * 基本的な設定方法
 *-----------------------------------------------------------------------------
 * 1. 本プラグインをプラグイン管理に追加してください。
 * 
 * 2. プラグイン設定画面で、グループの各項目を設定します(後述)。
 *
 * 3. 各ステートの設定画面で<RSGstateGroupId:xx>を入力します。
 *    xxはステートが属すグループIDです。
 *
 * 4. 必要に応じて、ステートの設定画面のメモ欄に規定のノートタグをつけます。
 *-----------------------------------------------------------------------------
 * グループ設定
 *-----------------------------------------------------------------------------
 * ---[name]---
 * ステートの名称です。処理には関わらないのでメモ程度に利用してください。
 * 
 * ---[type(同属打消方式)]---
 * 同属ステートの打消方式です。
 * １キャラに複数の同属ステートを付加できない仕様になっています。
 * 既に同属ステートが付加されていたとき、後から付加されるステートが上書するか、
 * 無効になるか、中和されるか(どちらも無効になるか)を設定できます。
 * 後述のrankTypeを用いる場合は、
 * 同属同ランク(同格)のステートにのみ適用されます。
 * 
 *      [overwrite(上書)]
 *          後から付加されるステートが付加され、
 *          既に付加されていた同属ステートは解除されます。
 * 
 *      [cancel(無効)]
 *          後から付加されるステートは無効になります。
 * 
 *      [neutaralize(中和)]
 *          後から付加されるステートは無効になりますが、
 *          既に付加されていた同属ステートも解除されます。
 * 
 * ---[rankType]---
 * ランク値による優先方式です。
 * この項目では、既に同属のステートが付加されていたとき、
 * 付加されようとしているステートのランク値の高低によって、
 * 上書と無効の関係を設定できます。
 * 
 *     [none(優先なし)]
 *          ランク値による優先を用いません。ランク値による優先は発生せず、
 *          常に前項のtypeによって判定されます。
 * 
 *     [higher(高ランク優先)]
 *          付加されている同属ステートよりも高ければ、「上書」になります。
 *          付加されている同属ステートよりも低ければ、「無効」になります。
 *          付加されている同属ステートと同値であれば、typeに従います。
 * 
 *     [lower(低ランク優先)]
 *          付加されている同属ステートよりも低ければ、「上書」になります。
 *          付加されている同属ステートよりも高ければ、「無効」になります。
 *          付加されている同属ステートと同値であれば、typeに従います。
 * 
 * ---[flag]---
 * 通常切替フラグです。切替の条件です。
 * ステートの設定画面のステート解除条件と対応しています。
 * 各項目が有効でも無効でも動作するものと、
 * 無効なら動作しないものがありますので注意してください。
 * 基本的には解除条件は有効にすることをお勧めします。
 * 同じ種類のフラグは１つしか用いることができませんが、
 * 異なる種類のフラグ(xFlag,sFlag)と共存できます。     
 * 
 *      [none(なし)]
 *      このフラグを用いません。
 * 
 *      [battleEnd(戦闘終了時)]
 *          戦闘終了時に切り替わります。有効でも無効でも動作します。
 * 
 *      [restrict(行動制約)]
 *          行動制約時に切り替わります。有効でも無効でも動作します。
 * 
 *      [turns(継続ターン)]
 *          継続ターン数によって切り替わります。
 *          自動解除のタイミングが「なし」の場合は動作しませんので、
 *          「行動終了時」または「ターン終了時」のどちらかに設定してください。
 * 
 *      [damage(歩数)]
 *          ダメージを受けたことによって切り替わります。
 *          有効でも無効でも動作します。
 *          「ダメージによる解除確率」に従います。
 * 
 *      [steps(歩数)]
 *          歩数によって切り替わります。
 *          無効なら動作しません(ステートの歩数カウンタが動作しないため)。
 * 
 * ---[xFlag]---
 * 拡張切替フラグです。
 * 属する各ステートのノートタグ<RSGxRate:xx>が、
 * 切り替え発生確率の判定に用いられます。
 * その記述がない、あるいは有効な値がない場合は、
 * 必ず切り替えが発生することになります。
 *
 *      [none(なし)]
 *      このフラグを用いません。
 * 
 *      [remove(解除時)]
 *          ステート解除時に切り替わります。ここでいう「解除」とは、
 *          このプラグインによる動作以外を要因とする解除に限られます。
 *          ただし相殺グループの付加による解除については
 * 
 *      [battleStart(戦闘開始)]
 *          戦闘開始時に切り替わります。
 * 
 *      [firstAction(初回行動時)]
 *          そのターンの初回行動時、厳密にはその直前に切り替わります。
 * 
 *      [allActionsEnd(全行動終了時)]
 *          そのターンの全ての行動が終わった後に切り替わります。
 * 
 *      [turnEnd]
 *          そのターンの全キャラクターの行動が終わった後に切り替わります。
 * 
 * ---[sFlag/sValue]---
 * 特殊切替フラグです。
 * sValueに有効な値が入力されていない場合は、
 * sFlagは作動しません。
 * 属する各ステートのノートタグ<RSGsRate:xx>が、
 * 切替の発生確率の判定に用いられます。
 * その記述がない、あるいは有効な値がない場合は、
 * 必ず切り替えが発生することになります。
 * sFlagを用いるには、その種類によってそれぞれのsValueを設定する必要があります。
 * この項目を[param]や[rateOfHMT]にした場合、
 * targetの動作が他のものと異なることになります。
 * 
 *      [none(なし)]
 *         このフラグを用いません。
 *      
 *      [addedState(付加ステート)]
 *          sValueにステートのIDを半角数字で記入してください。
 *          そのステートが付加された直後に切り替えが発生します。
 *          基本的に本プラグインの動作による付加には反応しませんが、
 *          属性攻撃による付加については反応します。
 * 
 *      [addedStateGroup(付加ステートグループ)]
 *          sValueにステートグループIDを設定して下さい。
 *          そのグループに属すステートが付加された直後に切り替えが発生します。
 *          それ以外は[addedState]と同じです。
 * 
 *      [damagedElement(属性ダメージ)]
 *          sValueに属性IDを半角数字で記入して下さい。
 *          その属性でダメージを受けた直後に切り替えが発生します。
 * 
 *      [usingSkill(使用スキル)]
 *          sValueには、スキルIDを半角数字で記入して下さい。
 *          スキルの成功に関わらず、
 *          そのスキルのコストを消費する直前に切り替えが発生します。
 * 
 *      [usingSkillType(使用スキルタイプ)]
 *          sValueには、スキルタイプIDを半角数字で記述して下さい。
 *          スキルの成功に関わらず、
 *          そのタイプに属すスキルのコストを消費する直前に切り替えが発生します。
 * 
 *      [param(能力値)]
 *          属するステートに「有効範囲」が発生するフラグです。
 *          有効範囲の値(下限と上限)には属するステートのランク値が用いられます。
 *          詳しくは、後述の「ランク値について」をお読みください。
 *          sValueには、能力値のID(＝アルファベットの略称)を記述して下さい。
 *          指定した能力値が、有効範囲に達すれば切替が発生します。
 *
 *          targetの項目が[rankDown]または[rankUp]の場合、
 *          下限に達すれば[rankDown]と同じ動作、
 *          上限に達すれば[rankUp]と同じ動作になります。
 *          targetの項目が[random]や[none]であれば解除されることになります。
 *          このフラグを持つグループに属するステートを付加されようとしたとき、
 *          有効範囲に合ったステートが自動的に付加されることになります。
 *          ノートタグに<RSGsRate:xx>がついていても無視されます。
 *
 *      [rateOfHMT(HP/MP/TPの残存割合)]
 *          属するステートに「有効範囲」が発生するフラグです。
 *          sValueには hp mp tp のいずれかを記述して下さい。
 *          残存値の最大値に対する割合によって切り替えが発生します。
 *          それ以外は[param]と同様です。
 * 
 * ---[target]---
 * 切替先となるステートを設定します。
 * flag、xFlag、sFlagで設定したそれぞれの条件が満たされたときに、
 * この設定に従って切り替わります。
 * target[state]の場合は、
 * 各ステートのノートタグ<RSGtargetState:xx>で設定したステートへ、
 * 切り替わることになります。
 * 「切替」の作動機序としては基本的に、
 *      1.元のステートが解除(削除)される
 *      2.切替先ステートが付加される
 * という機序で動きます。
 * ただしこの時の「解除」および「付加」は、
 *      xFlagの[remove]
 *      sFlagの[addedState]および[addedStateGroup]
 * を動作させることはありません。
 * 
 *       [none]
 *          何も起こらないか、sFlagに有効範囲がある場合、解除されます。
 * 
 *       [rankUp]
 *          同じグループの中でランク値が次に大きいステートに切り替わります。
 *          次に高いステートがない場合は何も起こりません。
 *          sflagに有効範囲がある場合は、rankUpもrankDownも変わりません。
 *          ただしrankType[none]の場合、
 *          rankUpとrankDownで有効範囲が異なります。
 * 
 *       [rankDown]
 *          同じグループの中でランク値が次に大きいステートに切り替わります。
 *          次に低いステートがない場合は何も起こりません。
 * 
 *       [random]
 *          同じグループのランダムなステートに切り替わります。
 *          sFlagに有効範囲がある場合は、単に解除されます。
 *
 *       [state]
 *          ノートタグ<RSGtargetState:xx>で指定したステートに切り替わります。
 *          ノートタグに有効な値が記入されていない場合は切り替えが起こりません。
 *
 * ---[element/eRate]---
 * グループに属性を関連付けます。
 * 属性によるダメージを受けると、それに関連づけられたグループの中で、
 *「最も適したステート」が付加されます。
 * eRateでその付加確率を設定できます。
 * 属性ダメージによる実際の付加確率は、
 * eRate * [ステート耐性率] * [運による補正率] です。
 * target[rankUp]の場合：最もランク値の低いものが付加されます。
 * target[rankDown]の場合：最もランク値の高いものが付加されます。
 * targetがそれ以外の場合で、
 *      rankType[higher]の場合：最もランク値の低いものが付加されます。
 *      rankType[lower]の場合：最もランク値の高いものが付加されます。
 * なお、sFlagに有効範囲がある場合は、有効範囲に合うステートが付加されます。
 * それ以外の場合、グループの中からランダムに選ばれます。
 * また、属性によるステートの付加については、
 * その他のステートグループのsFlag[state]および[stateGroup]を動作させます。
 * デフォルトはどちらも0で、この状態だと何も起こりません。
 * 
 * ---[counter]---
 * このグループに属するステートを相殺するグループ(相殺グループ)を設定できます。
 * 相殺グループのステートが既に付加されているとき、
 * 相殺グループのステートは解除され、
 * このグループに属するステートの付加も無効になります。
 * 相殺グループの設定にもcounterを設定することで、
 * 両者のグループが同時に共存することはなくなります。
 * ちょうど、type[neutral]と同じ挙動になります。
 * デフォルトは０で、この状態だと何も起こりません。
 * 
 *-----------------------------------------------------------------------------
 * ランク値について
 *-----------------------------------------------------------------------------
 * 前述の通り、ランク値は以下の２点の用途のために用いられます。
 * 
 * 【ランク値による優先】
 * 各ステートのノートタグ<RSGrank:xx>で設定できます。
 * ノートタグでランク値が設定されていない場合、
 * 「優先度」で入力されている値がランク値として処理に用いられます。
 * ランク値を必要としないグループとして設定にする場合は必要ありません。
 * 
 * 【sFlagに有効範囲がある場合のランク値の利用】
 * sFlag[param]および[rateOfHMT]の場合、
 * 切替の判定で用いる値の有効範囲について、
 + その上限値と下限値を決めるため、
 * ランク値の数値を転用することになります。
 * 上限値と下限値の決定方法は、以下のような仕様になっています。
 * rankTypeが[higher]の場合：
 *     上限値：次に高いステートのランク値(ない場合は無限大)
 *     下限値：現在のステートのランク値
 *     下限値≦有効範囲<上限値
 * rankTypeが[lower]の場合：
 *     上限値：現在のステートのランク値
 *     下限値：次に低いステートの同属ランク値(ない場合は無限小)
 *     下限値≦有効範囲<上限値
 * rankTypegが[none]の場合：
 *     targetが[rankUp]の場合：
 *         上限値：次に高い同属ステートのランク値(ない場合は無限大)
 *         下限値：現在のステートのランク値
 *         下限値≦有効範囲<上限値
 *     targetが[rankDown]の場合：
 *         上限値：現在のステートのランク値
 *         下限値：次に低いステートの同属ランク値(ない場合は無限小)
 *         下限値≦有効範囲<上限値
 *     targetが[none]あるいは[state]の場合：
 *         上限値：次に高い同属ステートのランク値(ない場合は無限大)
 *         下限値：次に低いステートの同属ランク値(ない場合は無限小)
 *         下限値<有効範囲<上限値
 * 
 *-----------------------------------------------------------------------------
 * ステートのノートタグ
 *-----------------------------------------------------------------------------
 *
 * <RSGgroupId:xx>(半角数字)
 *      グループのID番号を設定します。ステートは１つのグループにのみ属せます。
 *
 * <RSGrank:xx>(半角数字)
 *      ステートのグループ内でのランク値を設定します。
 *      この記述がない場合、ステートの「優先度」がランク値として用いられます。
 *
 * <RSGxRate:xx>(半角)
 *      拡張フラグ(xFlag)によるステート切り替えの作動確率です。
 *      この記述がない場合、xFlagは必ず作動します。
 *
 * <RSGsRate:xx>
 *      特殊フラグ(sFlag)によるステート切り替えの作動確率です。
 * 
 * <RSGtargetState:xx>
 *      属するグループの設定：target(切替先)が[state]に設定して下さい。
 *      設定しない場合、切り替えが作動しません。
 * 
 * 
 *-----------------------------------------------------------------------------
 * グループ数の拡張
 *-----------------------------------------------------------------------------
 * 10個以上のグループが必要な場合はEXTENSIONの項で追加してください。
 * EXTENSIONで設定した各グループのIDは、行番号に10を足したものになります。
 *
 *-----------------------------------------------------------------------------
 * RRT_StateGroupsのグループレシピ例
 *-----------------------------------------------------------------------------
 * 1. ターンごとに症状が重くなり最後には戦闘不能になる「致命傷」
 *      type[cancel]
 *      rankType[higher]
 *      flag[turns]
 *      target[rankUp](戦闘不能をグループに入れたくない場合、[state]でも可能です)
 * 第１ステート：
 *   自動解除のタイミング：行動終了時(１〜２ターン)、スリップダメージ
 *     ↓切替
 * 第２ステート：
 *   自動解除のタイミング：行動終了時(１〜２ターン)、スリップダメージ、防御力低下
 *     ↓切替
 * 第３ステート：
 *   自動解除のタイミング：行動終了時(１〜２ターン)、行動制約：行動不能
 *     ↓切替
 * 第４ステート：戦闘不能
 *
 * 2. 移動時にダメージを受け、戦闘が開始すると暴走する「戦闘狂」
 *     複数のグループを使います。
 * グループ１(移動時)：
 *     type[overwrite]
 *     rankType[none]
 *     xFlag[battlestart] 
 *     target[state]
 * グループ２(戦闘時)：
 *     type[overwrite]
 *     rankType[none]
 *     flag[battleEnd] 
 *     target[state]
 * 移動時ステート(グループ１)：
 *   <RSGtargetState:(戦闘時ステート)>、HP再生率低下(＝スリップダメージ)
 *      ↓戦闘開始時   ↑戦闘終了時
 * 戦闘時ステート(グループ)
 *   <RSGtargetState:(移動時ステート)>、行動制約「敵を攻撃」、攻撃力・俊敏性＋20%
 *
 * 3. 攻撃されるたびに耐性値がコロコロ変わるトリッキーなステート「道化の舞」
 *     type[overwrite]
 *     flag[damage]
 *     target[random]
 * ステート1：
 *     炎属性耐性 200%
 *     水属性耐性 70%
 * ステート2：
 *     水属性耐性 200%
 *     雷属性耐性 70%
 * ステート3：
 *     雷属性耐性 200%
 *     炎属性耐性 70%
 *
 */
//---------------------------------------------
//RRT.StateGroups
//
//---------------------------------------------

(function () {
    'use strict';

    var RRT = RRT || {};
    RRT.StateGroups = RRT.StateGroups || {};

    //データベースを読み込んでからグループのデータベースを初期化する
    RRT.StateGroups.databaseLoad = false;
    RRT.StateGroups._DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!RRT.StateGroups._DataManager_isDatabaseLoaded.call(this)) {
            return false;
        }
        if (!RRT.StateGroups.databaseLoad) {
            RRT.StateGroups.initNativeDatabase();
            RRT.StateGroups.databaseLoad = true;
        }
        return true;
    };

    Object.defineProperties(RRT.StateGroups, {
        //基礎データベース
        X_defaultDatabase: {
            writable: true,
            value: []
        },
        defaultDatabase: {
            get: function () {
                return this.X_defaultdatabase;
            },
            set: function (database) {
                this.X_defaultdatabase = database;
            }
        },
        //拡張データベース
        X_expandedDatabase: {
            writable: true,
            value: []
        },
        expandedDatabase: {
            get: function () {
                return this.X_expandedDatabase;
            },
            set: function (database) {
                this.X_expandedDatabase = database;
            }
        },
        //プラグインパラメータ上で定義されているステートの全データベース
        nativeDatabase: {
            get: function () {
                return this.X_defaultdatabase.concat(this.X_expandedDatabase);
            }
        },
        //プラグインコマンドで追加されるステートグループ(未実装)。
        X_addedDatabase: {
            enumerable: true,
            writable: true,
            value: []
        },
        addedDatabase: {
            get: function () {
                return this.X_addedDatabase;
            },
            set: function (addedGroups) {
                this.X_addedDatabase = addedGroups;
            },
            configurable: true
        },
        //データベース総合：
        database: {
            get: function () {
                if (this.addedDatabase) {
                    return this.nativeDatabase.concat(this.addedDatabase);
                } else {
                    return this.nativeDatabase;
                }
            },
            configurable: true
        }
    });

    RRT.StateGroups.pluginName = 'RRT_StateGroups_beta';
    RRT.StateGroups.parameters = function () {
        return PluginManager.parameters(this.pluginName);
    };

    //初期データベースを初期化
    RRT.StateGroups.initNativeDatabase = function () {
        this.initDefaultDatabase();
        //this.initExpandedDatabase();
    };
    //プラグインパラメータの中からステートグループの設定が格納されている各パラメータ名を配列で取得
    RRT.StateGroups.defaultGroupIds = function () {
        var ids = [];
        var params = this.parameters();
        for (var param in params) {
            if (/STATE_GROUP/i.test(param)) {
                ids.push(param.replace('STATE_GROUP', ''));
            }
        }
        return ids;
    };
    //デフォルトのグループ設定の定義
    RRT.StateGroups.defaultGroupSetting = function () {
        var setting = {
            type: "overwrite",
            rankType: "none",
            flag: "none",
            xFlag: "none",
            sFlag: "none",
            sValue: null,
            target: "none",
            element: 0,
            eRate: 0,
            counter: 0,
            states: {}
        };
        return setting;
    };
    //グループに属さないステートが属す「無グループ」の定義
    RRT.StateGroups.nonGroupSetting = function () {
        var setting = {
            id: 0,
            type: null,
            rankType: null,
            flag: null,
            xFlag: null,
            sFlag: null,
            sValue: null,
            target: null,
            element: 0,
            eRate: 0,
            counter: 0,
            states: {}
        };
        return setting;
    };
    //デフォルトデータベースを初期化
    RRT.StateGroups.initDefaultDatabase = function () {
        var database = [];
        var params = this.parameters();
        var ids = this.defaultGroupIds();
        database.push(this.nonGroupSetting());
        for (var i = 0; i < ids.length; i++) {
            if (params['STATE_GROUP' + ids[i]]) {
                database.push(JSON.parse(params['STATE_GROUP' + ids[i]]));
                for (var item in database[i + 1]) {
                    if (parseInt(database[i + 1][item], 10) >= 0) {
                        database[i + 1][item] = Number(database[i + 1][item])
                    }
                }
                database[i + 1].groupId = Number(ids[i]);
                database[i + 1].states = RRT.StateGroups.setStates(
                    database[i + 1].groupId, database[i + 1].target);
            } else {
                database.push(this.defaultGroupSetting());
                database[i + 1].groupId = Number(ids[i]);
                database[i + 1].states = RRT.StateGroups.setStates(
                    database[i + 1].groupId, database[i + 1].target);
            }
        }
        this.defaultDatabase = database;
    };
    //拡張データベースを初期化
    RRT.StateGroups.initExpandedDatabase = function () {
        var database = [];
        var expansions = JSON.parse(this.parameters().EXPANSION || 'null');
        for (var i = 0; i < expansions.length; i++) {
            database[i] = JSON.parse(expansions[i] || 'null');
            database[i].groupId = (this.defaultGroupIds().length + 1 + i);
            database[i].states = this.setStates(database[i].groupId, database[i].target);
        }
        this.expandedDatabase = database;
    };
    //各ステートの設定
    RRT.StateGroups.setStates = function (groupId, target) {
        var states = {};
        for (var i = 1; i < $dataStates.length; i++) {
            if (Number($dataStates[i].meta.RSGgroupId) === groupId) {
                states[$dataStates[i].id] = {
                    rank: $dataStates[i].priority,
                    xRate: 100,
                    sRate: 100,
                    target: 0
                };
                if (parseInt($dataStates[i].meta.RSGrank, 10) >= 0) {
                    states[$dataStates[i].id].rank = Number($dataStates[i].meta.RSGrank);
                }
                if (parseInt($dataStates[i].meta.RSGxRate, 10) >= 0) {
                    states[$dataStates[i].id].xRate = Number($dataStates[i].meta.RSGxRate);
                }
                if (parseInt($dataStates[i].meta.RSGsRate, 10) >= 0) {
                    states[$dataStates[i].id].sRate = Number($dataStates[i].meta.RSGsRate);
                }
            }
        }
        states = this.setTargets(states, target);
        return states;
    };
    //各ステートのターゲットの設定
    RRT.StateGroups.setTargets = function (states, target) {
        var ids = Object.keys(states);
        var my = {};
        var your = {};
        var which = 0;
        switch (target) {
            case "rankUp":
                ++which;
                break;
            case "rankDown":
                --which;
                break;
        }
        switch (target) {
            case "rankDown":
            case "rankUp":
                for (var i = 0; i < ids.length; i++) {
                    var nexts = [];
                    var defferences = [];
                    my = states[ids[i]];
                    for (var j = 0; j < ids.length; j++) {
                        your = states[ids[j]];
                        if ((ids[i] != ids[j]) &&
                            (which * (your.rank - my.rank) > 0)) {
                            defferences.push(which * (your.rank - my.rank));
                        }
                    }
                    for (var k = 0; k < ids.length; k++) {
                        your = states[ids[k]];
                        if (which * (your.rank - my.rank) === Math.min.apply(this, defferences)) {
                            nexts.push(Number(ids[k]));
                        }
                    }
                    if (nexts.length) {
                        states[ids[i]].target = Math.min.apply(this, nexts);
                    } else {
                        states[ids[i]].target = 0;
                    }
                }
                break;
            case "none":
                for (var l = 0; l < states.length; l++) {
                    states[ids[l]].target = -2;
                }
                break;
            case "random":
                for (var m = 0; m < states.length; m++) {
                    states[ids[m]].target = -1;
                }
                break;
            case "state":
                for (var n = 0; n < states.length; n++) {
                    if (!isNaN(Number($dataStates[ids[n]].meta.RSGtargetState))){
                    states[ids[n]].target = Number($dataStates[ids[n]].meta.RSGtargetState);
                    }
                }
                break;
        }
        return states;
    };
    //初期データベースに特定IDのグループはあるか
    RRT.StateGroups.isGroupInNativeDatabase = function (groupId) {
        var isIn = false;
        var natives = this.nativeDatabase;
        for (var i = 0; i < natives.length; i++) {
            if (natives[i] && natives[i]['id'] === groupId) {
                isIn = true;
                break;
            }
        }
        return isIn;
    };
    //初期データベースの最後のグループIdを取得(追加データベースのIDはこの値+1から始まる)
    RRT.StateGroups.lastNativeGroupId = function () {
        return (this.defaultGroupIds().length + this.expandedDatabase.length);
    };
    //特定グループの設定を取得
    RRT.StateGroups.getGroupSetting = function (groupId) {
        var group = {};
        loopout: for (var i = 0; i < this.database.length; i++) {
            if (this.database[i] && this.database[i].id === groupId) {
                group = this.database[i];
                break loopout;
            }
        }
        return group;
    };

    //---------------------------------------------
    //RSG Methods
    //判定などの際に頻繁に使うメソッドをまとめています
    //---------------------------------------------

    var RSGM = {};
    Object.defineProperties(RSGM, {
        database: {
            configurable: true,
            get: function () {
                return RRT.StateGroups.database;
            }
        },
        lastGroupId: {
            get: function () {
                return RRT.StateGroups.lastNativeGroupId() + RRT.StateGroups.addedDatabase.length;
            }
        }
    });

    //グループ内で最も高ランクのステート(数値；ステートID)
    RSGM.highestOf = function (groupId) {
        var highests = [];
        var ranks = [];
        var states = this.database[groupId].states;
        var ids = Object.keys(states);
        for (var i = 0; i < ids.length; i++) {
            ranks.push(states[ids[i]].rank);
        }
        for (var j = 0; j < ids.length; j++) {
            if (states[ids[j]].rank === Math.max.apply(this, ranks)) {
                highests.push(Number(ids[j]));
            }
        }
        if (highests.length) {
            return highests[Math.floor(Math.random() * highests.length)]
        } else {
            return 0;
        }
    };
    //グループ内で最も低ランクのステート(数値：ステートID)
    RSGM.lowestOf = function (groupId) {
        var lowests = [];
        var ranks = [];
        var states = this.database[groupId].states;
        var ids = Object.keys(states);
        for (var i = 0; i < ids.length; i++) {
            ranks.push(states[ids[i]].rank);
        }
        for (var j = 0; j < ids.length; j++) {
            if (states[ids[j]].rank === Math.min.apply(this, ranks)) {
                lowests.push(Number(ids[j]));
            }
        }
        if (lowests.length) {
            return lowests[Math.floor(Math.random() * lowests.length)]
        } else {
            return 0;
        }
    };
    //グループの代表ステート(数値：ステートID)
    RSGM.primitiveStateOf = function (groupId) {
        if (this.database[groupId].target === "rankUp") {
            return RSGM.lowestOf(groupId);
        } else if (this.database[groupId].target === "rankDown") {
            return RSGM.highestOf(groupId);
        } else if (this.database[groupId].rankType === "higher") {
            return RSGM.lowestOf(groupId);
        } else if (this.database[groupId].rankType === "lower") {
            return RSGM.highestOf(groupId);
        } else {
            var ids = Object.keys(this.database[groupId].states)
            return Number(ids[Math.floor(Math.random() * ids.length)]);
        }
    };
    //ステートがなんらかのグループに属すか(真偽値)
    RSGM.isRSG = function (stateId) {
        if (stateId && Number($dataStates[stateId].meta.RSGgroupId)) {
            return true;
        } else {
            return false;
        }

    };
    //ステートが属すグループの情報(オブジェクト：グループ設定)
    RSGM.groupOf = function (stateId) {
        if (this.isRSG(stateId)) {
            var groupId = Number($dataStates[stateId].meta.RSGgroupId);
            return this.database[groupId];
        } else {
            return this.database[0];
        }
    };
    //ステートの実際のターゲット(数値：ステートID)
    RSGM.targetOf = function (stateId) {
        if (this.isRSG(stateId)) {
            var states = this.groupOf(stateId).states;
            var target = states[stateId].target;
            if (target >= 0) {
                return target;
            } else {
                return Number(Object.keys(states)[Math.floor(Math.random() * Object.keys(states))]);
            }
        } else {
            return 0;
        }
    };
    //相殺グループのステート(配列)
    RSGM.countersOf = function (stateId) {
        var counters = [];
        var keys = Object.keys(this.database[this.groupOf(stateId).counter].states);
        for (var i = 0; i < keys.length; i++) {
            counters.push(Number(keys[i]));
        }
        return counters;
    };
    //他の同属ステート(配列：ステートID)
    RSGM.othersOf = function (stateId) {
        var others = [];
        var states = Object.keys(this.groupOf(stateId).states);
        for (var i = 0; i < states.length; i++) {
            if (states[i] != stateId) {
                others.push(Number(states[i]));
            }
        }
        return others;
    };
    //高ランクの同属ステート(配列：ステートID)
    RSGM.highersOf = function (stateId) {
        var highers = [];
        var others = this.othersOf(stateId);
        var states = this.groupOf(stateId).states;
        for (var i = 0; i < others.length; i++) {
            if (states[others[i]].rank > states[stateId].rank) {
                highers.push(others[i]);
            }
        }
        return highers;
    };
    //低ランクの同属ステート(配列：ステートID)
    RSGM.lowersOf = function (stateId) {
        var lowers = [];
        var others = this.othersOf(stateId);
        var states = this.groupOf(stateId).states;
        for (var i = 0; i < others.length; i++) {
            if (states[others[i]].rank < states[stateId].rank) {
                lowers.push(others[i]);
            }
        }
        return lowers;
    };
    //同ランクの同属ステート(配列：ステートID)
    RSGM.equalsOf = function (stateId) {
        var equals = [];
        var others = this.othersOf(stateId);
        var states = this.groupOf(stateId).states;
        for (var i = 0; i < others.length; i++) {
            if (states[others[i]].rank === states[stateId].rank) {
                equals.push(others[i]);
            }
        }
        return equals;
    };
    //特定のステートより強い(優先される)同属ステート(配列：ステートID)
    //特定のステートの付加を無効化するステートが列挙されます
    RSGM.strongersOf = function (stateId) {
        var strongers = this.countersOf(stateId);
        switch (this.groupOf(stateId).type + "_" + this.groupOf(stateId).rankType) {
            case "overwrite_higher":
                strongers = strongers.concat(this.highersOf(stateId));
                break;
            case "overwrite_lower":
                strongers = strongers.concat(this.lowersOf(stateId));
                break;
            case "cancel_higher":
            case "neutralize_higher":
                strongers = strongers.concat(this.equalsOf(stateId));
                strongers = strongers.concat(this.highersOf(stateId));
                break;
            case "cancel_lower":
            case "neutaralize_lower":
                strongers = strongers.concat(this.lowersOf(stateId));
                strongers = strongers.concat(this.equalsOf(stateId));
                break;
            case "cancel_none":
            case "neutralize_none":
                strongers = strongers.concat(this.othersOf(stateId));
                break;
        }
        return strongers;
    };
    //特定のステートより弱い同属ステート(配列：ステートID)
    //特定ステートの付加によって上書あるいは解除されるステートが列挙されます。
    RSGM.weakersOf = function (stateId) {
        var weakers = this.countersOf(stateId);
        switch (this.groupOf(stateId).type + "_" + this.groupOf(stateId).rankType) {
            case "overwrite_higher":
            case "neutralize_higher":
                weakers = weakers.concat(this.lowersOf(stateId));
                weakers = weakers.concat(this.equalsOf(stateId));
                break;
            case "overwrite_lower":
            case "neutaralize_lower":
                weakers = weakers.concat(this.equalsOf(stateId));
                weakers = weakers.concat(this.highersOf(stateId));
                break;
            case "overwrite_none":
            case "neutralize_none":
                weakers = weakers.concat(this.othersOf(stateId));
                break;
            case "cancel_higher":
                weakers = weakers.concat(this.lowersOf(stateId));
                break;
            case "cancel_lower":
                weakers = weakers.concat(this.highersOf(stateId));
                break;
        }
        return weakers;
    };
    //次に高いステートあるいは次に低いステート(数値：ステートID)
    //第二引数に"higher"か"lower"を入力します。
    RSGM.nextOf = function (stateId, highOrLow) {
        var nexts = [];
        var defferences = [];
        var states = this.groupOf(stateId).states
        var others = this.othersOf(stateId);
        var which;
        switch (highOrLow) {
            case "higher":
                which = 1;
                break;
            case "lower":
                which = -1;
                break;
        }
        for (var i = 0; i < others.length; i++) {
            var defference = which * (states[others[i]].rank - states[stateId].rank);
            if (defference > 0) {
                defferences.push(defference);
            }
        }
        for (var j = 0; j < others.length; j++) {
            var identified = which * (states[others[j]].rank - states[stateId].rank)
            if (Math.min.apply(this, defferences) === identified) {
                nexts.push(others[j]);
            }
        }
        if (nexts.length) {
            return nexts[Math.floor(Math.random() * nexts.length)];
        } else {
            return 0;
        }
    };
    //ステートに有効範囲があるかどうか
    RSGM.isLimited = function (stateId) {
        if ((this.groupOf(stateId).sFlag === "param") ||
            (this.groupOf(stateId).sFlag === "rateOfHMT")) {
            return true;
        } else {
            return false;
        }
    };
    //【sFlag】ステートの有効範囲(配列：[上限値、下限値、範囲の種類])
    RSGM.limitRangeOf = function (stateId) {
        var limit = [-Infinity, Infinity, "neigher"];
        var states = this.groupOf(stateId).states;
        var condition = this.groupOf(stateId).rankType + "_" + this.groupOf(stateId).target;
        var nextHigher = this.nextOf(stateId, "higher");
        var nextLower = this.nextOf(stateId, "lower");
        switch (condition) {
            case "none_random":
            case "higher_random":
            case "lower_random":
                return limit;
            case "none_rankUp":
            case "higher_rankUp":
            case "higher_rankDown":
            case "higher_state":
            case "higher_none":
                if (nextLower){
                limit[0] = states[stateId].rank;
                }
                if (nextHigher) {
                    limit[1] = states[nextHigher].rank;
                }
                limit[2] = "equalLow";
                return limit;
            case "none_rankDown":
            case "lower_rankUp":
            case "lower_rankDown":
            case "lower_state":
            case "lower_none":
                if (nextLower) {
                    limit[0] = states[nextLower].rank;
                }
                if (nextHigher){
                limit[1] = states[stateId].rank;
                }
                limit[2] = "equalHigh";
                return limit;
            case "none_state":
            case "none_none":
                nextLower = this.nextOf(stateId, "lower");
                nextHigher = this.nextOf(stateId, "higher");
                if (nextLower) {
                    limit[0] = states[nextLower].rank;
                }
                if (nextHigher) {
                    limit[1] = states[nextHigher].rank;
                }
                return limit;
            default:
                return limit;
        }
    };
    //【sFlag】ステートの有効範囲に対して、valueがどの位置にあるか(文字列："in"または"high"または"low")
    RSGM.whichSideOfLimit = function (stateId, value) {
        var limit = this.limitRangeOf(stateId);
        switch (limit[2]) {
            case "equalLow":
                if (value < limit[0]) {
                    return "low";
                } else if (value >= limit[1]) {
                    return "high";
                } else {
                    return "in";
                }
            case "equalHigh":
                if (value <= limit[0]) {
                    return "low";
                } else if (value > limit[1]) {
                    return "high";
                } else {
                    return "in";
                }
            case "neither":
                if (value <= limit[0]) {
                    return "low";
                } else if (value >= limit[1]) {
                    return "high";
                } else {
                    return "in";
                }
        }
    }
    //【sFlag】ステートの有効範囲から外れた際に付加されるべきステート
    //有効範囲に合っているならそのまま第一引数stateIdを返します
    RSGM.matchStateToLimitOf = function (stateId, value) {
        var group = this.groupOf(stateId);
        switch (this.whichSideOfLimit(stateId, value)) {
            case "in":
                return stateId;
            case "high":
            case "low":
                if (group.target === "state" ||
                    group.target === "none") {
                    return this.targetOf(stateId);
                } else
                if (group.target === "rankUp" ||
                    group.target === "rankDown") {
                    var matches = [];
                    var others = this.othersOf(stateId);
                    for (var i = 0; i < others.length; i++) {
                        if (this.whichSideOfLimit(others[i], value) === "in") {
                            matches.push(others[i]);
                        }
                    }
                    return matches[Math.floor(Math.random() * matches.length)];
                }
        }
    }

    //---------------------------------------------
    //ADDINGS ON CORE SCRIPT
    //コアスクリプトへの追加事項
    //---------------------------------------------
    //--------------------
    //RSG STATES
    //グループに属するステート
    //--------------------

    //既に付加されている、何らかのグループに属すステート(配列：ステートID)
    Game_Battler.prototype.RSG_statesOfRSG = function () {
        var rsgs = [];
        for (var i = 0; i < this._states.length; i++) {
            if (RSGM.isRSG(this._states[i])) {
                rsgs.push(this._states[i]);
            }
        }
        return rsgs;
    };

    //--------------------
    //REMOVE DUPLICATION
    //同属ステート重複の打消
    //--------------------

    //特定のステートの付加を無効化するステートが付加されているか(真偽値)
    Game_Battler.prototype.RSG_hasStrongersOf = function (stateId) {
        var RSGs = this.RSG_statesOfRSG();
        var allStrongers = RSGM.strongersOf(stateId);
        for (var i = 0; i < RSGs.length; i++) {
            for (var j = 0; j < allStrongers.length; j++) {
                if (RSGs[i] === allStrongers[j]) {
                    return true;
                }
            }
        }
    };
    //既に付加されている、特定のステートの付加によって解除される同属ステート(配列：ステートID)
    Game_Battler.prototype.RSG_weakersOf = function (stateId) {
        var weakers = [];
        var states = this.RSG_statesOfRSG();
        var allWeakers = RSGM.weakersOf(stateId);
        for (var i = 0; i < states.length; i++) {
            for (var j = 0; j < allWeakers.length; j++) {
                if (states[i] === allWeakers[j]) {
                    weakers.push(states[i]);
                }
            }
        }
        return weakers;
    };
    //強いステートがあれば弱いステートを削除(処理)
    //同じグループに属する複数のステートが付加されていない状況を作るための処理です。
    //打消の判定で同属のステートが同時に付加されることは防がれますが、念のため。
    //現在は無効化しています
    /*
    Game_Battler.prototype.RSG_eraseDuplication = function () {
        var states = this.RSG_statesOfRSG();
        for (var i = 0; i < states.length; i++) {
            if (RSGM.groupOf(states[i]).rankType === "higher" ||
                RSGM.groupOf(states[i]).ranktype === "lower") {
                if (this.RSG_hasStrongersOf(states[i])) {
                    this.eraseState(states[i]);
                }
            }
        }
    };
    */

    //--------------------
    //GROUP ELEMENT
    //グループ属性
    //--------------------

    //代表ステートの付加(処理)
    Game_Action.prototype.RSG_addPrimitiveState = function (target, groupId, element) {
        if (RSGM.database[groupId].element === element) {
            var adding = RSGM.primitiveStateOf(groupId);
            var chance = RSGM.database[groupId].eRate;
            chance *= target.stateRate(adding);
            chance *= this.lukEffectRate(target);
            if (Math.randomInt(100) < chance) {
                target.addState(adding);
            }

        }
    };

    //特定の属性で攻撃する際の処理
    Game_Action.prototype.RSG_elementDamage = function (target) {
        if (this.item().damage.elementId < 0) {
            var elements = this.subject().attackElements();
            for (var i = 1; i < RSGM.database.length; i++) {
                for (var j = 0; j < elements.length; j++) {
                    this.RSG_addPrimitiveState(target, RSGM.database[i].groupId, elements[j]);
                }
            }
        } else {
            var element = this.item().damage.elementId;
            for (var k = 1; k < RSGM.database.length; k++) {
                this.RSG_addPrimitiveState(target, RSGM.database[k].groupId, element);
            }
        }
    };

    //--------------------
    //STATE CHANGE
    //ステートの切替
    //--------------------

    //特定のステートが切替条件(フラグ)を満たした場合の切替先(数値：ステートID)
    Game_Battler.prototype.RSG_changeResult = function (stateId) {
        if (RSGM.isLimited(stateId)) {
            var value = this.RSG_getValueForLimit(stateId);
            return RSGM.matchStateForLimit(stateId, value);
        } else {
            return RSGM.targetOf(stateId);
        }
    };
    //ステートの切り替え(処理)
    Game_Battler.prototype.RSG_change = function (stateId) {
        if (this.RSG_changeResult(stateId)) {
            this.eraseState(stateId);
            this.RSG_addStateWithoutFlag(this.RSG_changeResult(stateId));
        }
    };
    //【xFlag,sFlag】発生確率のある切替(処理)
    Game_Battler.prototype.RSG_rateToChange = function (stateId, rate) {
        if (Math.randomInt(100) < rate) {
            this.RSG_change(stateId);
        }
    };
    //一部のフラグを除く共通の処理をまとめたものです。
    Game_Battler.prototype.RSG_flagToChange = function (flagName) {
        var states = this.RSG_statesOfRSG();
        for (var i = 0; i < states.length; i++) {
            var group = RSGM.groupOf(states[i]);
            switch (flagName) {
                case group.flag:
                    this.RSG_change(states[i]);
                    break;
                case group.xFlag:
                    this.RSG_rateToChange(states[i], group[states[i].xRate])
                    break;
                case group.sFlag:
                    this.RSG_rateToChange(states[i], group[states[i].sRate])
                    break;
            }
        }
    };

    //--------------------
    //FLAG
    //通常フラグ
    //--------------------

    //通常フラグ：戦闘終了時
    //解除条件「戦闘終了時」が有効でない場合でも、作動します。
    Game_Battler.prototype.RSG_flag_battleEnd = function () {
        this.RSG_flagToChange("battleEnd");
    };
    //通常フラグ：行動制約時
    //解除条件「行動制約によって解除」が有効ではない場合でも、作動します。
    Game_Battler.prototype.RSG_flag_restrict = function () {
        this.RSG_flagToChange("restriction");
    };
    //通常フラグ：継続ターン数
    //「自動解除のタイミング」が「なし」の場合は、作動しません。
    Game_Battler.prototype.RSG_flag_turns = function (timing) {
        var states = this.RSG_statesOfRSG();
        for (var i = 0; i < states.length; i++) {
            if (RSGM.groupOf(states[i]).flag === "turns" &&
                this.isStateExpired(states[i]) &&
                $dataStates[states[i]].autoRemovalTiming === timing) {
                this.RSG_change(states[i]);
            }
        }
    };
    //通常フラグ：被ダメージ時
    //解除条件「ダメージで解除」が有効でない場合でも、作動します。
    //確率にはデータベース(States.json)にある「chanceByDamage」を用います。
    Game_Battler.prototype.RSG_flag_damage = function () {
        var states = this.RSG_statesOfRSG();
        for (var i = 0; i < states.length; i++) {
            if (RSGM.groupOf(states[i]).flag === "damage") {
                if (Math.randomInt(100) < $dataStates[states[i]].chanceByDamage) {
                    this.RSG_change(states[i]);
                }
            }
        }
    };
    //通常フラグ：歩数
    //解除条件「歩数で解除」が有効でない場合は、作動しません。
    Game_Actor.prototype.RSG_flag_steps = function (state) {
        if (state.removeByWalking &&
            RSGM.groupOf(state.id).flag === "steps" &&
            this._stateSteps[state.id] > 0 &&
            this._stateSteps[state.id] - 1 === 0) {
            this.RSG_change(state.id);
        }
    };

    //--------------------
    //XFLAG
    //拡張フラグ
    //--------------------

    //拡張フラグ：解除時に切替
    Game_Battler.prototype.RSG_xFlag_remove = function () {
        var states = this._result.removedStates;
        for (var i = 0; i < states.length; i++) {
            var group = RSGM.groupOf(states[i]);
            if (group.xFlag === "remove") {
                this.RSG_rateToChange(states[i], group.states[states[i]].xRate);
            }
        }
    };
    //拡張フラグ：戦闘開始時に切替
    Game_Battler.prototype.RSG_xFlag_battleStart = function () {
        this.RSG_flagToChange("battleStart");
        this.RSG_firstActionON;
    };
    //そのターンの初回の行動かどうか
    //全行動終了またはターン終了または戦闘終了のたびにtrueが代入されます。
    //なんらかの行動をとるたびにfalseが代入されます。
    Game_Battler.prototype.RSG_firstAction = true;
    Game_Battler.prototype.RSG_firstActionON = function () {
        this.RSG_firstAction = true;
    };
    Game_Battler.prototype.RSG_firstActionOFF = function () {
        this.RSG_firstAction = false;
    };
    //拡張フラグ：初回行動時に切替
    //そのターンでの初めての行動の直前にステートの切替が発生します。
    Game_Battler.prototype.RSG_xFlag_firstAction = function () {
        if (this.RSG_firstAction) {
            this.RSG_flagToChange("firstAction");
        }
        this.RSG_firstActionOFF();
    };
    //拡張フラグ：全行動終了時に切替
    //そのターンでの行動が全て終了した後にステートの切替が発生します。
    Game_Battler.prototype.RSG_xFlag_allActionsEnd = function () {
        this.RSG_flagToChange("allActionsEnd");
        this.RSG_firstActionON();
    };
    //拡張フラグ：ターン終了時
    //ターン終了時に切替が発生します。
    Game_Battler.prototype.RSG_xFlag_turnEnd = function () {
        this.RSG_flagToChange("turnEnd");
        this.RSG_firstActionON();
    };

    //--------------------
    //SFLAG
    //特殊フラグ
    //--------------------

    //特殊フラグ：ステート付加時
    //特殊フラグ：ステートグループ付加時
    //切替は当該ステートの付加直後に発生します。
    Game_Battler.prototype.RSG_sFlag_addedState = function (stateId) {
        if (this._result.addedStates.some(function (addedStateId) {
                return addedStateId === stateId;
            })) {
            var states = this.RSG_statesOfRSG();
            for (var i = 0; i < states.length; i++) {
                var group = RSGM.groupOf(states[i]);
                if ((group.sFlag === "addedState") &&
                    (group.sValue === stateId)) {
                    this.RSG_rateToChange(states[i], group.states[states[i]].sRate);
                } else if (group.sFlag === "addedStateGroup" &&
                    group.sValue === RSGM.groupOf(stateId).groupId) {
                    this.RSG_rateToChange(states[i], group.states[states[i]].sRate);
                }
            }
        }
    };
    //特殊フラグ；スキル使用時
    //特殊フラグ：スキルタイプ使用時
    //切替は当該スキルの効果発動の直前に発生します。
    Game_Battler.prototype.RSG_sFlag_usingSkill = function (item) {
        if (DataManager.isSkill(item)) {
            var states = this.RSG_statesOfRSG();
            for (var i = 0; i < states.length; i++) {
                var group = RSGM.groupOf(states[i]);
                if ((group.sFlag === "usingSkill") &&
                    (group.sValue === item.id)) {
                    this.RSG_rateToChange(states[i], group.states[states[i]].sRate);
                } else if (
                    (group.sFlag === "usingSkillType") &&
                    (group.sValue === item.type)) {
                    this.RSG_rateToChange(states[i], group.state[states[i]].sRate);
                }
            }
        }
    };
    //特殊フラグ：属性によるダメージ時
    //切替はダメージが与えられた直後に発生します
    Game_Action.prototype.RSG_sFlag_damagedElement = function (target) {
        var states = target.RSG_statesOfRSG();
        for (var i = 0; i < states.length; i++) {
            var group = RSGM.groupOf(states[i]);
            if (group.sFlag === "damagedElement") {
                if (this.item().damage.elementId < 0) {
                    var elements = this.subject().attackElements();
                    for (var j = 0; j < elements.length; j++) {
                        if (elements[j] === group.sValue) {
                            target.RSG_rateToChange(states[i], group.state[states[i]].sRate);
                            break;
                        }
                    }
                } else {
                    if (this.item().damage.elementId === group.sValue) {
                        target.RSG_rateToChange(states[i], group.states[states[i]].sRate);
                    }
                }
            }
        }
    };
    //【sFlag[param][rateOfHMT]】有効範囲のための値を取得
    Game_Battler.prototype.RSG_getValueForLimitOf = function (stateId) {
        var group = RSGM.groupOf(stateId);
        if (group.sFlag === "param") {
            return this[group.sValue];
        } else if (group.sFlag === "rateOfHMT") {
            switch (group.sValue) {
                case "hp":
                case "Hp":
                case "HP":
                    return Math.floor(this.hpRate() * 100);
                case "mp":
                case "Mp":
                case "MP":
                    return Math.floor(this.mpRate() * 100);
                case "tp":
                case "Tp":
                case "TP":
                    return Math.floor(this.TpRate() * 100);
            }
        } else {
            return -Infinity;
        }
    };
    //【sFlag[param][rateOfHMT]】の場合に、設定されている値がステートの有効範囲にあるか
    Game_Battler.prototype.RSG_isValueOkForLimitOf = function (stateId) {
        if (RSGM.isLimited(stateId)) {
            var value = this.RSG_getValueForLimitOf(stateId);
            if (RSGM.whichSideOfLimit(stateId, value) === "in") {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };
    //【sFlag[param][rateOfHMT]】有効範囲に合ったステートを取得
    Game_Battler.prototype.RSG_matchStateToLimitOf = function (stateId) {
        var value = this.RSG_getValueForLimitOf(stateId);
        return RSGM.matchStateToLimitOf(stateId, value);
    };
    //【sFlag[param][rateOfHMT]】付加されている各ステートを有効範囲に合ったステートに変える
    //refresh()に追加している処理です。常時監視。
    Game_Battler.prototype.RSG_matchStatesToLimits = function () {
        var states = this.RSG_statesOfRSG();
        for (var i = 0; i < states.length; i++) {
            if (RSGM.isLimited(states[i])) {
                if (!this.RSG_isValueOkForLimitOf(states[i])) {
                    this.eraseState(states[i]);
                    this.RSG_addStateWithoutFlag(this.RSG_matchStateToLimitOf(states[i]));
                }
            }
        }
    };

    //--------------------
    //ADD STATE
    //ステート付加の処理
    //--------------------

    //特定のステートより弱い同属ステートと、相殺ステートの解除(処理)
    Game_Battler.prototype.RSG_beforeAddingState = function (stateId) {
        var weakers = this.RSG_weakersOf(stateId);
        for (var i = 0; i < weakers.length; i++) {
            if (RSGM.groupOf(weakers[i]).groupId == RSGM.groupOf(stateId).groupId) {
                this.eraseState(weakers[i]);
            } else {
                RRT.StateGroups._Game_Battler_removeState.call(this, weakers[i]);
            }
        }
    };
    //ステートを付加する前の処理に追加する処理
    Game_Battler.prototype.RSG_matchState = function (stateId) {
        if (RSGM.isRSG(stateId) &&
            this.RSG_hasStrongersOf(stateId)) {
            stateId = 0;
        }
        if (!this.RSG_isValueOkForLimitOf(stateId)) {
            stateId = this.RSG_matchStateToLimitOf(stateId);
        }
        return stateId;
    };
    //sFlag[addedState]および[addedStateGroup]による判定を避ける形のステート付加
    //「切替」によるステート付加は、sFlag[addedState]および[addedStateGroup]を作動させません。
    Game_Battler.prototype.RSG_addStateWithoutFlag = function (stateId) {
        var match = this.RSG_matchState(stateId);
        this.RSG_beforeAddingState(stateId);
        stateId = match;
        RRT.StateGroups._Game_Battler_addState.call(this, stateId);
    };

    //--------------------
    //REFRESH
    //グループステートの正常化
    //--------------------

    Game_Battler.prototype.RSG_refresh = function () {
        //this.RSG_eraseDuplication();
        this.RSG_matchStatesToLimits();
    };

    //---------------------------------------------
    //OVERWRITINGS ON CORE SCRIPT
    //コアスクリプト改変事項
    //---------------------------------------------

    //Game_Battler.prototype.onBattleEnd
    RRT.StateGroups._Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function () {
        this.RSG_flag_battleEnd();
        RRT.StateGroups._Game_Battler_onBattleEnd.apply(this, arguments);
    };
    //Game_Battler.prototype.onRestrict
    RRT.StateGroups._Game_Battler_onRestrict = Game_Battler.prototype.onRestrict;
    Game_Battler.prototype.onRestrict = function () {
        this.RSG_flag_restrict();
        RRT.StateGroups._Game_Battler_onRestrict.apply(this, arguments);
    };
    //Game_Battler.prototype.removeStatesAuto
    RRT.StateGroups._Game_Battler_removeStatesAuto = Game_Battler.prototype.removeStatesAuto;
    Game_Battler.prototype.removeStatesAuto = function (timing) {
        this.RSG_flag_turns(timing);
        RRT.StateGroups._Game_Battler_removeStatesAuto.apply(this, arguments);
    };
    //Game_Battler.prototype.onDamage
    RRT.StateGroups._Game_Battler_onDamage = Game_Battler.prototype.onDamage;
    Game_Battler.prototype.onDamage = function (value) {
        this.RSG_flag_damage();
        RRT.StateGroups._Game_Battler_onDamage.apply(this, arguments);
    };
    //Game_Actor.prototype.updateStateSteps
    RRT.StateGroups._Game_Actor_updateStateSteps = Game_Actor.prototype.updateStateSteps;
    Game_Actor.prototype.updateStateSteps = function (state) {
        this.RSG_flag_steps(state);
        RRT.StateGroups._Game_Actor_updateStateSteps.aplly(this, arguments);
    };
    //Game_Battler.prototype.removeState
    RRT.StateGroups._Game_Battler_removeState = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function (stateId) {
        RRT.StateGroups._Game_Battler_removeState.apply(this, arguments);
        this.RSG_xFlag_remove(stateId);
    };
    //Game_Battler.prototype.useItem
    RRT.StateGroups._Game_Battler_useItem = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function (item) {
        this.RSG_xFlag_firstAction();
        RRT.StateGroups._Game_Battler_useItem.apply(this, arguments);
        this.RSG_sFlag_usingSkill(item);
    };
    //Game_Battler.prototype.onBattleStart
    RRT.StateGroups._Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function () {
        this.RSG_xFlag_battleStart();
        RRT.StateGroups._Game_Battler_onBattleStart.apply(this, arguments);
    };
    //Game_Battler.prototype.onAllActionsEnd
    RRT.StateGroups._Game_Battler_onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function () {
        this.RSG_xFlag_allActionsEnd();
        RRT.StateGroups._Game_Battler_onAllActionsEnd.apply(this, arguments);
    };
    //Game_Battler.prototype.onTurnEnd
    RRT.StateGroups._Game_Battler_onTurnEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function () {
        this.RSG_xFlag_turnEnd();
        RRT.StateGroups._Game_Battler_onTurnEnd.apply(this, arguments);
    };
    //Game_Battler.prototype.addState
    RRT.StateGroups._Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function (stateId) {
        var match = this.RSG_matchState(stateId);
        this.RSG_beforeAddingState(stateId);
        stateId = match;
        RRT.StateGroups._Game_Battler_addState.call(this, stateId);
        this.RSG_sFlag_addedState(stateId);
    };
    //Game_Action.prototype.executeHpDamage
    RRT.StateGroups._Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        RRT.StateGroups._Game_Action_executeHpDamage.apply(this, arguments);
        this.RSG_sFlag_damagedElement(target);
        this.RSG_elementDamage(target);
    };
    //Game_Battler.prototype.refresh
    RRT.StateGroups._Game_Battler_refresh = Game_Battler.prototype.refresh;
    Game_Battler.prototype.refresh = function () {
        this.RSG_refresh();
        RRT.StateGroups._Game_Battler_refresh.apply(this, arguments);
    };
    //---------------------------------------------
    //Game_Interpreter
    //
    //---------------------------------------------

    //デバッグ用に置いておきます。
    var _RSG_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _RSG_Game_Interpreter_pluginCommand.call(this, command, args);
        if (command == "RSG") {
            console.log(RSGM.database);
        }
    };

})();
