export default class MyMod {
    prestart() {
        sc.PlayerModel.inject({
            addSkillPoints(points, element, all, extra) {
                this.parent(points*2, element, all, extra);
            }
        });
    }
}